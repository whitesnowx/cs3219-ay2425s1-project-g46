import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const View = () => {
  const { id } = useParams(); 
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/view/${id}`);
        setQuestion(response.data);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id]);

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h1>{question.title}</h1>
      <p>Category: {question.category}</p>
      <p>Complexity: {question.complexity}</p>
      <p>Description: {question.description}</p>
    </div>
  );
};

export default View;