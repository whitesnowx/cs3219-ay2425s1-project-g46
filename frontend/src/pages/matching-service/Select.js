// Author(s): Andrew
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Select.css";
import NavBar from "../../components/NavBar";

function Signup() {
  const [errorMessage, setErrorMessage] = useState({
    topic: '',
    difficultyLevel: ''
  })

  const [formData, setFormData] = useState({
    topic: '',
    difficultyLevel: '',
    email: '',
    token: '',
  });

  const difficultyLevelOptions = [
    {label: "Easy", value: "easy"},
    {label: "Medium", value: "medium"},
    {label: "Hard", value: "hard"}
  ];

  const topicOptions = [
    {label: "Databases", value: "Databases"},
    {label: "Algorithms", value: "Algorithms"},
    {label: "Data Structures", value: "Data Structures"}
  ];

  const handleInput = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }));

  };


  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`${formData.topic}, ${formData.difficultyLevel}`)
    
    let newErrorMessage = {};

    if (formData.topic === "") {
      newErrorMessage.topic = "Please selecet a topic";
    } else {
      delete newErrorMessage.topic;
    }

    if (formData.difficultyLevel === "") {
      newErrorMessage.difficultyLevel = "Please select a difficulty level";
    } else {
      delete newErrorMessage.difficultyLevel;
    }

    setErrorMessage(newErrorMessage);
    
    if (Object.keys(newErrorMessage).length == 0) {
      const updatedFormData = {
        ...formData,
        email: sessionStorage.getItem("email"),
        token: sessionStorage.getItem("token"),
      };
      axios.post(`http://localhost:5002/matching/requestmatching`, updatedFormData)
      .then(res => {
        navigate('/matching/findingmatch');
      });
      

    } 
    
  };


  return (
    <div >
      <NavBar />
      <div id="SelectFormContainer">
        <h1>Selection</h1>
        <form action='' onSubmit={handleSubmit}>
          <div className='formGroup'>
            <label htmlFor='topic' className='inputLabel'><strong>Topic</strong></label>
            <select name='topic' value={formData.topic} onChange={handleInput} className="dropdown">
              <option value="">Select Topic</option>
              {topicOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage.topic && <span className='errorLabel'> {errorMessage.topic}</span>}

          </div>
          <div className='formGroup'>
            <label htmlFor='difficultyLevel' className='inputLabel'><strong>Difficulty Level</strong></label>
            <select name="difficultyLevel" value={formData.difficultyLevel} onChange={handleInput} className="dropdown">
              <option value="">Select Difficulty Level</option>
              {difficultyLevelOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errorMessage.difficultyLevel && <span className='errorLabel'> {errorMessage.difficultyLevel}</span>}
          
          </div>
          <div class="confirmButton">
            <button class="confirm-button" type="submit">Find match</button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default Signup