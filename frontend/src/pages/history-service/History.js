// Author(s): <name(s)>
import React, { useEffect, useState } from "react";
// import "./styles/Question.css";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import useSessionStorage from "../../hook/useSessionStorage";

function History() {
    const [data, setData] = useState([]);
    const userId = sessionStorage.getItem("email"); 

    useEffect(() => {
        if (userId) {
            // Fetch collaborations for the current user
            getUserCollaborations(userId)
                .then((collaborations) => {
                    setData(collaborations);
                })
                .catch((error) => {
                    console.error("Error fetching collaborations:", error);
                });
        }
    }, [userId]);

    return (
        <div>
            <NavBar />
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>link</th>
                            <th>String Column</th>
                            <th>Button Column</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.content}</td>
                                <td>
                                    <button onClick={() => alert(item.text)}>
                                        Click Me
                                    </button> {/* Second column: button */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default History;

//     <div>
//       <NavBar />
//       <div id="question">
//         <div>
//           <h1>Questions List</h1>
//           {/* dropdown list to filter questions by complexity */}
//           <select value={complexity} onChange={handleChange}>
//             <option value="">Select a complexity</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//           <table id="questionList">
//             {/* Display the data in table format */}
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Title</th>
//                 <th>Category</th>
//                 <th>Complexity</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.id}</td>
//                   <td>
//                     <Link to={`/question/${item.id}`}>
//                       {item.title}
//                     </Link>
//                   </td>
//                   <td>{item.category}</td>
//                   <td id="complexity">{item.complexity}</td>
//                   <td>{item.description}</td>
//                   <td>
//                     <div className="action-button-container">
//                       <button className="edit-question" onClick={() => handleEdit(item)}>Edit</button>
//                       <button className="delete-question" onClick={() => handleDelete(item.id)}>Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Question;

    

// function Question() {
//   const [data, setData] = useState([]);
//   const [complexity, setComplexity] = useState(""); //set complexity filter
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     complexity: "",
//     description: "",
//   });

//   const [selectedQuestionId, setSelectedQuestionId] = useState(null); // For tracking the question to edit
//   const [error, setError] = useState(''); // State to store error message
//   const [loading, setLoading] = useState(true);

//   // Fetch user data from API when the component mounts
//   useEffect(() => {
//     // Set loading to true before calling API
//     setLoading(true);
//     fetch("http://localhost:5000/question/")
//       .then((response) => response.json())
//       .then((data) => {
//         setData(data)
//         // Switch loading to false after fetch is completed
//         setLoading(false);
//       })
//       .catch((error) => {
//         setData(null);
//         setLoading(false);
//         console.error("Error fetching data:", error)
//       });
//   }, []);

//   if (loading) {
//     return (
//       <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
//     );
//   }

//   // Handle filtering from dropdown event for complexity
//   const handleChange = (event) => {
//     setComplexity(event.target.value);
//   };

//   const filteredData = data.filter((item) => {
//     if (complexity) {
//       return (
//         item.complexity &&
//         item.complexity.toLowerCase() === complexity.toLowerCase()
//       );
//     }
//     return true;
//   });

//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     console.log(name);
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Input text before sending:", formData);
//     try {
//       // Set loading to true before calling API
//       setLoading(true);

//       if (selectedQuestionId) {
//         const response = await axios.put(
//           `http://localhost:5000/question/update/${selectedQuestionId}`,
//           formData
//         );
//         console.log("Form updated successfully:", response.data);
//       } else {
//         const response = await axios.post(
//           "http://localhost:5000/question/add",
//           formData
//         );
//         console.log("Form submitted successfully:", response.data);
//       }

//       window.location.reload();
//       setLoading(false);
//     } catch (error) {
//       if (error.response && error.response.status === 409) {
//         setError('A question with the same title already exists. Please enter a new question.');
//         setLoading(false);
//       }
//       console.error("Error submitting form:", error);
//     }
//   };

//   const handleEdit = (item) => {
//     setSelectedQuestionId(item.id);
//     setFormData({
//       title: item.title,
//       category: item.category,
//       complexity: item.complexity,
//       description: item.description,
//     });
//     window.scrollTo({
//       top: 0,
//       behavior: 'smooth',
//     });
//   };

//   const handleDelete = async (id) => {
//     try {
//       // Set loading to true before calling API
//       setLoading(true);
      
//       await axios.delete(`http://localhost:5000/question/delete/${id}`);
//       console.log("Question deleted successfully");
      
//       window.location.reload();
//       setLoading(false);
//     } catch (error) {
//       console.error("Error deleting question:", error);
//     }
//   };

//   const handleReturnToAdd = () => {
//     setSelectedQuestionId(null);
//     setFormData({
//       title: "",
//       category: "",
//       complexity: "",
//       description: "",
//     });
//   };

//   return (
//     <div>
//       <NavBar />
//       <div id="question">
//         <div>
//           <h1>Questions List</h1>
//           {/* dropdown list to filter questions by complexity */}
//           <select value={complexity} onChange={handleChange}>
//             <option value="">Select a complexity</option>
//             <option value="easy">Easy</option>
//             <option value="medium">Medium</option>
//             <option value="hard">Hard</option>
//           </select>
//           <table id="questionList">
//             {/* Display the data in table format */}
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Title</th>
//                 <th>Category</th>
//                 <th>Complexity</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item.id}>
//                   <td>{item.id}</td>
//                   <td>
//                     <Link to={`/question/${item.id}`}>
//                       {item.title}
//                     </Link>
//                   </td>
//                   <td>{item.category}</td>
//                   <td id="complexity">{item.complexity}</td>
//                   <td>{item.description}</td>
//                   <td>
//                     <div className="action-button-container">
//                       <button className="edit-question" onClick={() => handleEdit(item)}>Edit</button>
//                       <button className="delete-question" onClick={() => handleDelete(item.id)}>Delete</button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Question;
