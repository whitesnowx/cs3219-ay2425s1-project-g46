import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function QuestionPage() {
    const { questionId } = useParams();
    const [questionData, setQuestionData] = useState([]);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/question/${questionId}`);
                setQuestionData(response.data);
            } catch (error) {
                console.error("Error fetching question:", error);
            }
        };

        fetchQuestion();
    }, [questionId]);

    if (!questionData) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>{questionData.title}</h1>
            <p>Category: {questionData.category}</p>
            <p>Complexity: {questionData.complexity}</p>
            <p>Description: {questionData.description}</p>
        </div>
    )
}

export default QuestionPage;