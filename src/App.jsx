import React, { useState, useEffect } from 'react' // Import React, useState, and useEffect hooks
import './App.css' // Import the CSS file for styles

// TodoItem component displays a single todo item
function TodoItem({ todo, onToggle, onDelete }) { // Receives todo object, onToggle, and onDelete functions as props
  return (
    <li // Render a list item
      className={`todo-item${todo.completed ? ' completed' : ''}`} // Add classes for styling and completed state
      onClick={() => onToggle(todo.id)} // Call onToggle with todo id when clicked
    >
      {todo.text} {/* Display the todo text */}
      <button // Delete button
        className="delete-btn" // Style for delete button
        onClick={e => { // Handle click event
          e.stopPropagation() // Prevent toggling when clicking delete
          onDelete(todo.id) // Call onDelete with todo id
        }}
        aria-label="Delete task" // Accessibility label
      >
        × {/* Cross symbol for delete */}
      </button>
    </li>
  )
}

// TodoList component displays a list of todos
function TodoList({ todos, onToggle, onDelete }) { // Receives todos array, onToggle, and onDelete functions as props
  return (
    <ul className="todo-list"> {/* Unordered list for todos with styling */}
      {todos.map(todo => ( // Map over todos array
        <TodoItem // Render TodoItem for each todo
          key={todo.id} // Unique key for each item
          todo={todo} // Pass todo object as prop
          onToggle={onToggle} // Pass onToggle function as prop
          onDelete={onDelete} // Pass onDelete function as prop
        />
      ))}
    </ul>
  )
}

// Main App component
export default function App() {
  // State for the list of todos
  const [todos, setTodos] = useState(() => { // useState with initializer to load from localStorage
    const saved = localStorage.getItem('super-todos') // Get todos from localStorage
    return saved ? JSON.parse(saved) : [ // If found, parse and use them
      { id: 1, text: 'Try this app out!', completed: false }, // Initial todo
    ]
  })

  // State for the new todo input
  const [input, setInput] = useState('') // useState hook for input value

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('super-todos', JSON.stringify(todos)) // Save todos as JSON
  }, [todos]) // Run effect when todos change

  // Function to add a new todo
  const addTodo = () => {
    if (input.trim() === '') return // Do nothing if input is empty
    setTodos([ // Update todos state
      ...todos, // Keep existing todos
      { id: Date.now(), text: input, completed: false } // Add new todo
    ])
    setInput('') // Clear input field
  }

  // Function to toggle completed state of a todo
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => // Map over todos
        todo.id === id // If todo id matches
          ? { ...todo, completed: !todo.completed } // Toggle completed
          : todo // Otherwise, keep as is
      )
    )
  }

  // Function to delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id)) // Remove todo with matching id
  }

  return (
    <div className="app-container"> {/* Container div with styles */}
      <h1 className="app-title">Super To-Do App</h1> {/* App title */}
      <div className="input-row"> {/* Input and button row */}
        <input // Input for new todo
          className="todo-input" // Input styles
          value={input} // Bind input value to state
          onChange={e => setInput(e.target.value)} // Update input state on change
          placeholder="Add a new task..." // Placeholder text
        />
        <button className="add-btn" onClick={addTodo}>Add</button> {/* Add button */}
      </div>
      {/* Conditional rendering: show message if no todos */}
      {todos.length === 0 ? (
        <p className="empty-message">No tasks yet! Add your first to-do above.</p> // Message if no todos
      ) : (
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} /> // Render TodoList with props
      )}
    </div>
  )
}
