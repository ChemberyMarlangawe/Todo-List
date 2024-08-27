import { useEffect, useState } from 'react';
import "./style.css";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [todos, setTodos] = useState(()=> {
    const storedTodos = localStorage.getItem("Task");
    return storedTodos ==null? [] : JSON.parse(storedTodos);
  });
  const [editID, setEditID] = useState(null);
  const [editTodo, setEditTodo] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setTodos(currentTodos => [
      ...currentTodos,
      { id: crypto.randomUUID(), title: newItem, completed: false },
    ]);

    setNewItem("");
  }

  function toggleTodo(id, completed) {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }

  function startEditing(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    setEditID(id);
    setEditTodo(todoToEdit.title);
  }

  function saveEdit() {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === editID ? { ...todo, title: editTodo } : todo
      )
    );
    setEditID(null);
    setEditTodo("");
  }

  function discardEdit() {
    setEditTodo(originalTitle);
    setEditID(null);
    setOriginalTitle("");
  }

  useEffect(() => { 
    localStorage.setItem('Task', JSON.stringify(todos))
  }, [todos])


  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit} className="new-item-form">
          <h1 className="header">Todo List</h1>
          <p>This is a simple project done to practice my React JS skills</p>
          <div className="input-container">
            <div className="input-text">
              <label htmlFor="task">New Task</label>
              <input
                type="text"
                id="task"
                name="task"
                placeholder="What is your task for today?"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button className="btn-add" type="submit">Add Task</button>
          </div>
        </form>
        <h1 className="header2">My Tasks</h1>
        <ul className="task-list">
          {todos.map(todo => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={e => toggleTodo(todo.id, e.target.checked)}
                />
                {editID === todo.id ? (
                  <input
                    type="text"
                    value={editTodo}
                    onChange={e => setEditTodo(e.target.value)}
                  />
                ) : (
                  todo.title
                )}
              </label>
              {editID === todo.id ? (
                <>
                <button className="btn-save" onClick={saveEdit}>Save</button>
                <button className="btn-discard"onClick={discardEdit}>Discard Changes</button>
                </>
              ) : (
                <>
                  <button
                    className="btn-edit"  
                    onClick={() => startEditing(todo.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
