
import React, { useState, useEffect  } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { io } from 'socket.io-client';

const Test = () => {
  const [inputText, setInputText] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [socket, setSocket] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Input text before sending:", inputText);
    try {
      const response = await axios.post("http://localhost:5000/submit/text", {
        inputText,
      });
      console.log("Form submitted successfully:", response.data);
      setResponseMessage(response.data.message);
      setInputText("");
    } catch (error) {
      setResponseMessage("Error submitting form");
      console.error("Error submitting form:", error);
    }
  };
  
  useEffect(() => {
    const newSocket = io("http://localhost:5003");
    setSocket(newSocket);

    // Receive the current text from the server (useful when opening a new tab, makes sure text are the same)
    newSocket.emit('getCurrentText');
    newSocket.on('currentText', (text) => {
      setInputText(text);
    });

    //listen for text updates and update accordingly
    newSocket.on('updateText', (text) => {
      setInputText(text);
    });

    return () => {
      newSocket.off("updateText");
  };
  }, []);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);

    if (socket) {
      socket.emit('textChange', newText);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          id="inputText"
          name="inputText"
          placeholder="Start typing here..."
          value={inputText}
          onChange={handleTextChange}
        ></textarea>
        <br />
        <button type="submit">Submit</button>
      </form>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default Test;
