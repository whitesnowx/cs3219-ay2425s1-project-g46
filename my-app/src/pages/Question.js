import React, { useEffect, useState } from 'react';
import './Question.css';

function Question() {
  const [data, setData] = useState([]);
  const [complexity, setComplexity] = useState(''); //set complexity filter

  // Fetch user data from API when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/api/data/questions')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Handle filtering from dropdown event for complexity
  const handleChange = (event) => {
    setComplexity(event.target.value);
  };

  const filteredData = data.filter((item) => {
    if (complexity) {
        return item.complexity && item.complexity.toLowerCase() === complexity.toLowerCase();
      }
    return true;
  });

  return (
    <div>
      <h1>Questions List</h1>
        {/* dropdown list to filter questions by complexity */}
        <select value={complexity} onChange={handleChange}>
        <option value="">Select a complexity</option>
        <option value="easy">Easy</option>
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
  );
}

export default Question;
