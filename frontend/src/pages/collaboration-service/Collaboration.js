// Author(s): Andrew, Calista, Xinyi, Xiu Jia, Xue Ling
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/Collaboration.css"; // Make sure to create this CSS file for styles

function Collaboration() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: "", isBeingEditedBy: "" });
  const [selectedCollabId, setSelectedCollabId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch collaboration data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5002/collaboration/");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedCollabId) {
        // Update existing collaboration
        await axios.put(`http://localhost:5002/collaboration/update/${selectedCollabId}`, formData);
      } else {
        // Create new collaboration
        await axios.post("http://localhost:5002/collaboration/create", formData);
      }
      setFormData({ id: "", isBeingEditedBy: "" });
      setSelectedCollabId(null);
      setLoading(false);
      window.location.reload(); // Reload to get updated data
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("There was an issue with your submission.");
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedCollabId(item.id);
    setFormData({ id: item.id, content: item.isBeingEditedBy });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5002/collaboration/delete/${id}`);
      window.location.reload(); // Reload to get updated data
    } catch (error) {
      console.error("Error deleting collaboration:", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000); // Convert seconds to milliseconds
      return date.toLocaleString(); // Adjust format as needed
    }
    return 'N/A'; // Default value if no timestamp is provided
  };

  return (
    <div className="collaboration">
      <h1>{selectedCollabId ? "Edit Collaboration" : "Add Collaboration"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id"
          placeholder="id"
          value={formData.id}
          onChange={handleFormChange}
          required
        />
        <textarea
          name="isBeingEditedBy"
          placeholder="isBeingEditedBy"
          value={formData.isBeingEditedBy}
          onChange={handleFormChange}
          required
        />
        <button type="submit">{selectedCollabId ? "Update" : "Add"}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Collaboration List</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h3>{item.id}</h3>
            <p>{item.pageID}</p>
            <p>{item.isBeingEditedBy}</p>
            <p>{formatTimestamp(item.createdOn)}</p>
            <p>{formatTimestamp(item.editingStartTime)}</p>
            <p>{formatTimestamp(item.lastEdited)}</p>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Collaboration;
