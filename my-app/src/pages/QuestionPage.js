import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./QuestionPage.css";
import axios from "axios";

function QuestionPage() {
  const { questionId } = useParams();
  const [questionData, setQuestionData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/question/${questionId}`);
        setQuestionData(response.data);
      } catch (error) {
        setQuestionData(null);
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [questionId]);

  if (!questionData) {
    return (
      <div id="errorContainer" class="container">
        <h1>Error 404</h1>
        <div class="row">
          <button id="backBtn" class="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div id="questionContainer" class="container">
      {/* Title of Question */}
      <div class="row">
        <h1 id="questionTitle">{questionData.title}</h1>
      </div>

      <div id="questionTagContainer" class="row">
        <div class="questionTag">
          {questionData.category}
        </div>
        <div class="questionTag">
          {questionData.complexity}
        </div>
      </div>

      <div class="row">
        <p>{questionData.description}</p>
      </div>

      <div class="row">
        <button id="backBtn" class="btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  )
}

export default QuestionPage;