import React, { useState } from "react";
import "./index.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal"); // added priority
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddClick = () => {
    setShowForm(true);
    setTitle("");
    setDescription("");
    setPriority("normal");
    setEditIndex(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newTodo = { title, description, priority };
    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex] = newTodo;
      setTodos(updated);
    } else {
      setTodos([...todos, newTodo]);
    }
    setShowForm(false);
    setTitle("");
    setDescription("");
    setPriority("normal");
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const todo = todos[index];
    setTitle(todo.title);
    setDescription(todo.description);
    setPriority(todo.priority);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  const togglePriority = () => {
    setPriority((prev) => (prev === "important" ? "normal" : "important"));
  };

  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {showForm && (
        <div className="add-list-box">
          <h3>Add list</h3>
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="priority" onClick={togglePriority}>
            {priority === "important" ? "Important (Red)" : "Normal (Green)"}
          </button>
          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button className="close" onClick={() => setShowForm(false)}>✕</button>
        </div>
      )}

      <div className="todo-list-box">
        <h1>Todo List</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="search......."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="search-indicator"></div>
          <button className="add-btn" onClick={handleAddClick}>Add</button>
        </div>

        <div className="cards-container">
          {filteredTodos.map((todo, index) => (
            <div
              className={`card ${todo.priority === "important" ? "important-card" : "normal-card"}`}
              key={index}
            >
              <p><strong>Title:</strong> {todo.title}</p>
              <p><strong>Description:</strong></p>
              <p>{todo.description}</p>
              <p><strong>Priority:</strong> {todo.priority}</p>
              <div className="card-buttons">
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
