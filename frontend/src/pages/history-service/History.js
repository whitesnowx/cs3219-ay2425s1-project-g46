// Author(s): <name(s)>
import React, { useEffect, useState } from "react";
// import "./styles/Question.css";
import axios from "axios";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
// import useLocalStorage from "../../hook/useLocalStorage";

function History() {
    const [data, setData] = useState([]);
    // const userId = useSessionStorage.getItem("email", ""); 
    
    const [userId] = sessionStorage.getItem("email")
    // const [userId, setUserId] = useSessionStorage("", "");
    useEffect(() => {
        console.log({userId})
        
        const fetchCollaborations = async () => {
            if (userId) {
                try {
                    const response = await axios.get(`http://localhost:5004/history/${userId}`); // Adjust the endpoint as needed
                    setData(response);
                } catch (error) {
                    console.error("Error fetching collaborations:", error);
                }
            }
        };
        fetchCollaborations();
    }, [userId]);

    return (
        <div>
            <NavBar />
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>link</th>
                            {/* <th>String Column</th> */}
                            <th>Button Column</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                {/* <td>{item.content}</td> */}
                                <td>
                                    <button onClick={() => alert(item.id)}>
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