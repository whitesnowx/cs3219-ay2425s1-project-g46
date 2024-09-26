import React, { useEffect, useState } from "react";
import "./Question.css";
import axios from "axios";

function Question() {
  const [data, setData] = useState([]);
  const [complexity, setComplexity] = useState(""); //set complexity filter
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    complexity: "",
    description: "",
  });

  // Fetch user data from API when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/questions/get")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle filtering from dropdown event for complexity
  const handleChange = (event) => {
    setComplexity(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (complexity) {
      return (
        item.complexity &&
        item.complexity.toLowerCase() === complexity.toLowerCase()
      );
    }
    return true;
  });

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    console.log(name);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Input text before sending:", formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/questions/add",
        formData
      );
      console.log("Form submitted successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div id="question">
      <h1>Make Questions</h1>
      <form id="questionForm" onSubmit={handleSubmit}>
        <div>
          <input
            type="Title"
            name="title"
            placeholder="Title"
            onChange={handleFormChange}
            autoComplete="off"
            required
          />
          <input
            type="Category"
            name="category"
            placeholder="Category"
            onChange={handleFormChange}
            required
          />
          <select name="complexity" onChange={handleFormChange} required>
            <option value="">Select Complexity</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div>
          <textarea
            id="description"
            name="description"
            placeholder="Enter your description here..."
            onChange={handleFormChange}
          ></textarea>
          <button type="submit">Add</button>
        </div>
      </form>
      <div>
        <h1>Questions List</h1>
        {/* dropdown list to filter questions by complexity */}
        <select value={complexity} onChange={handleChange}>
          <option value="">Select a complexity</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <table>
          {/* Display the data in table format */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Complexity</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.complexity}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Question;
