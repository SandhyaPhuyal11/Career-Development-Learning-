// ====== CONFIGURATION ======
const API_KEY = '7a665c1d0c9b8d3e01ee64e65a8c917d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// ====== DOM ELEMENTS ======
const moviesGrid = document.getElementById('movies');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const tabBtns = document.querySelectorAll('.tab-btn');

// ====== STATE ======
let currentPage = 1;
let currentQuery = '';
let isFetching = false;
let currentCategory = 'trending';
let currentGenre = '';
let totalPages = 1;

// ====== INITIAL LOAD ======
document.addEventListener('DOMContentLoaded', () => {
  fetchGenres();
  fetchAndDisplayMovies();
});

// ====== EVENT LISTENERS ======
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  moviesGrid.innerHTML = '';
  fetchAndDisplayMovies();
});

genreSelect.addEventListener('change', () => {
  currentGenre = genreSelect.value;
  currentPage = 1;
  moviesGrid.innerHTML = '';
  fetchAndDisplayMovies();
});

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.getAttribute('data-category');
    currentPage = 1;
    currentQuery = '';
    searchInput.value = '';
    moviesGrid.innerHTML = '';
    fetchAndDisplayMovies();
  });
});

// ====== INFINITE SCROLL ======
window.addEventListener('scroll', () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
    !isFetching &&
    currentPage < totalPages
  ) {
    currentPage++;
    fetchAndDisplayMovies(true);
  }
});

// ====== FETCH GENRES ======
function fetchGenres() {
  fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.genres) {
        genreSelect.innerHTML = '<option value="">All Genres</option>' +
          data.genres.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
      }
    });
}

// ====== FETCH & DISPLAY MOVIES ======
function fetchAndDisplayMovies(append = false) {
  if (isFetching) return;
  isFetching = true;
  showLoader();
  hideError();

  let url = '';
  let params = `api_key=${API_KEY}&page=${currentPage}`;

  if (currentQuery) {
    if (currentGenre) {
      // Use discover with query and genre
      url = `${BASE_URL}/discover/movie?${params}&with_genres=${currentGenre}&query=${encodeURIComponent(currentQuery)}`;
    } else {
      url = `${BASE_URL}/search/movie?${params}&query=${encodeURIComponent(currentQuery)}`;
    }
  } else if (currentGenre) {
    // Use discover for genre filtering
    url = `${BASE_URL}/discover/movie?${params}&with_genres=${currentGenre}`;
  } else {
    // Use category endpoints
    switch (currentCategory) {
      case 'top_rated':
        url = `${BASE_URL}/movie/top_rated?${params}`;
        break;
      case 'upcoming':
        url = `${BASE_URL}/movie/upcoming?${params}`;
        break;
      case 'now_playing':
        url = `${BASE_URL}/movie/now_playing?${params}`;
        break;
      default:
        url = `${BASE_URL}/trending/movie/day?${params}`;
    }
  }

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    })
    .then(data => {
      totalPages = data.total_pages || 1;
      if (data.results.length === 0 && currentPage === 1) {
        showError('No movies found.');
        moviesGrid.innerHTML = '';
      } else {
        renderMovies(data.results, append);
      }
    })
    .catch(err => {
      showError('Failed to fetch movies. Please try again.');
    })
    .finally(() => {
      hideLoader();
      isFetching = false;
    });
}

// ====== RENDER MOVIES ======
function renderMovies(movies, append = false) {
  const html = movies.map(movie => movieCardHTML(movie)).join('');
  if (append) {
    moviesGrid.insertAdjacentHTML('beforeend', html);
  } else {
    moviesGrid.innerHTML = html;
  }
}

function movieCardHTML(movie) {
  return `
    <div class="movie-card">
      <img class="movie-poster" src="${movie.poster_path ? IMG_BASE_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}" />
      <div class="movie-info">
        <div class="movie-title">${movie.title}</div>
        <div class="movie-meta">⭐ ${movie.vote_average} | 🗓️ ${movie.release_date || 'N/A'}</div>
        <div class="movie-overview">${movie.overview || 'No description available.'}</div>
      </div>
    </div>
  `;
}

// ====== LOADER & ERROR HANDLING ======
function showLoader() {
  loader.classList.remove('hidden');
}
function hideLoader() {
  loader.classList.add('hidden');
}
function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}
function hideError() {
  errorMessage.classList.add('hidden');
} 