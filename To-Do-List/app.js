// Selectors
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const todoList = document.getElementById('todo-list');
const priorityFilter = document.getElementById('priority-filter');

let todos = [];
let editId = null;

// Load from localStorage
function loadTodos() {
  const data = localStorage.getItem('todos');
  todos = data ? JSON.parse(data) : [];
}

// Save to localStorage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Render todos
function renderTodos() {
  todoList.innerHTML = '';
  const filter = priorityFilter.value;
  let filtered = todos;
  if (filter !== 'All') {
    filtered = todos.filter(todo => todo.priority === filter);
  }
  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    // Task text and priority
    if (editId === todo.id) {
      // Edit mode
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = todo.text;
      editInput.className = 'todo-text';
      editInput.id = 'edit-input';
      const editPriority = document.createElement('select');
      ['High','Medium','Low'].forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        if (todo.priority === p) opt.selected = true;
        editPriority.appendChild(opt);
      });
      editPriority.id = 'edit-priority';
      li.appendChild(editInput);
      li.appendChild(editPriority);
      // Save/Cancel buttons
      const btns = document.createElement('div');
      btns.className = 'action-btns';
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.className = 'save';
      saveBtn.onclick = () => saveEdit(todo.id);
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'cancel';
      cancelBtn.onclick = () => { editId = null; renderTodos(); };
      btns.appendChild(saveBtn);
      btns.appendChild(cancelBtn);
      li.appendChild(btns);
    } else {
      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;
      // Priority label
      const prioritySpan = document.createElement('span');
      prioritySpan.className = 'priority-' + todo.priority.toLowerCase();
      prioritySpan.textContent = ' [' + todo.priority + ']';
      span.appendChild(prioritySpan);
      li.appendChild(span);
      // Complete checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.completed;
      checkbox.onchange = () => toggleComplete(todo.id);
      li.appendChild(checkbox);
      // Edit/Delete buttons
      const btns = document.createElement('div');
      btns.className = 'action-btns';
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.className = 'edit';
      editBtn.onclick = () => { editId = todo.id; renderTodos(); };
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'delete';
      deleteBtn.onclick = () => deleteTodo(todo.id);
      btns.appendChild(editBtn);
      btns.appendChild(deleteBtn);
      li.appendChild(btns);
    }
    todoList.appendChild(li);
  });
}

// Add todo
function addTodo(e) {
  e.preventDefault();
  const text = taskInput.value.trim();
  const priority = priorityInput.value;
  if (!text) return;
  todos.push({
    id: Date.now(),
    text,
    priority,
    completed: false
  });
  saveTodos();
  taskInput.value = '';
  renderTodos();
}

todoForm.addEventListener('submit', addTodo);

// Delete todo
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  renderTodos();
}

// Toggle complete
function toggleComplete(id) {
  todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
  saveTodos();
  renderTodos();
}

// Save edit
function saveEdit(id) {
  const editInput = document.getElementById('edit-input');
  const editPriority = document.getElementById('edit-priority');
  const newText = editInput.value.trim();
  const newPriority = editPriority.value;
  if (!newText) return;
  todos = todos.map(todo => todo.id === id ? { ...todo, text: newText, priority: newPriority } : todo);
  editId = null;
  saveTodos();
  renderTodos();
}

// Filter
priorityFilter.addEventListener('change', renderTodos);

// Initial load
loadTodos();
renderTodos(); 