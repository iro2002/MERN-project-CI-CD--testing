import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/items"; 
function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  // fetch items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description) return;

    try {
      if (editId) {
        // update existing item
        await axios.put(`${API_URL}/${editId}`, form);
        setEditId(null);
      } else {
        // create new item
        await axios.post(API_URL, form);
      }
      setForm({ name: "", description: "" });
      fetchItems();
    } catch (err) {
      console.error("Error saving item", err);
    }
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description });
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchItems();
      } catch (err) {
        console.error("Error deleting item", err);
      }
    }
  };

  return (
    <div className="App">
      <h1>Item Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <button type="submit">
          {editId ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* Items list */}
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
