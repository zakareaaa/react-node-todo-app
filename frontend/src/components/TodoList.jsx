import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TodoList() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the whole user object from login
  const user = location.state?.user;

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`http://localhost:8000/todos/${user.id}`);
      const data = await res.json();
      if (res.ok) setTodos(data.todos);
      else setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch todos.");
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo) return;

    try {
      const res = await fetch(`http://localhost:8000/todos/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo })
      });

      const data = await res.json();
      if (res.ok) {
        setTodos(data.todos);
        setNewTodo("");
      } else setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add todo.");
    }
  };

  const toggleTodo = async (todoId) => {
    try {
      const res = await fetch(`http://localhost:8000/todos/${user.id}/${todoId}`, {
        method: "PATCH"
      });

      const data = await res.json();
      if (res.ok) setTodos(data.todos);
      else setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to toggle todo.");
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`http://localhost:8000/todos/${user.id}/${todoId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok) setTodos(data.todos);
      else setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete todo.");
    }
  };

  return (
    <div className="todo-container">
      <h2>{user?.name}'s Todo List</h2>

      {/* Back to Login button */}
      <button 
        onClick={() => navigate("/login")} 
        style={{ marginBottom: "1rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "4px" }}
      >
        LogOut
      </button>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Enter new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {message && <p style={{ color: "#00bcd4" }}>{message}</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <span onClick={() => toggleTodo(todo._id)} style={{ cursor: "pointer" }}>
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo._id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>

  );
}
