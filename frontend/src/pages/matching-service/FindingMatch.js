import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Select.css";
import socket from "./utils/socket";
import NavBar from "../../components/NavBar";


function FindingMatch() {


    const [displayedText, setDisplayedText] = useState("");
    const [timeLeft, setTimeLeft] = useState(10); // Set timer to 10 seconds
    const [matchStatus, setMatchStatus] = useState(""); // To track if match is found or not
    const fullText = "  Matching in progress.... ";
    const navigate = useNavigate();


    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);  // Stop the timer when it reaches zero
                    setMatchStatus("No match found"); // Set status when timer reaches 0
                    console.log("Matching failed due to timeout");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000); // Update every second

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, []);

    
    // Loading animation 
    useEffect(() => {
        let currentIndex = 0;
        let interval;

        const startTyping = () => {
        setDisplayedText("");
        interval = setInterval(() => {
            setDisplayedText((prev) => prev + fullText[currentIndex]);
            currentIndex++;

            // Stop typing when the text is fully typed
            if (currentIndex >= fullText.length - 1) {
            clearInterval(interval); 
            setTimeout(() => {
                setDisplayedText(""); 
                currentIndex = 0; 
                startTyping();
            }, 1000);  // Wait for 1 second before clearing and restarting
            }
        }, 100);  // Typing speed (100ms delay between each character)
        };

        startTyping();

        // Cleanup interval on unmount to avoid memory leaks
        return () => clearInterval(interval);
    }, []);
    

    // Listen for the "match_found" event from the server
    useEffect(() => {
        socket.on("match_found", (data) => {
            console.log("Client found a match:", data);
            navigate('/matching/matchfound', { state: { matchedData: data } });
        });
    
        // Cleanup the socket listener when the component unmounts
        return () => {
            socket.off("match_found");
        };
    }, [navigate]); 


    return (
        <div>
            <NavBar />
            <div id="FindingMatchController">
                {matchStatus === "" ? ( // Show typing and timer when match status is empty
                    <>
                        <h1>{displayedText}</h1>
                        <h1>Time left: {timeLeft} seconds</h1> {/* Display the timer */}
                        <button>Cancel</button>
                    </>
                ) : (
                    <>
                        <h1>{matchStatus}</h1> {/* Show match status when match is found or time runs out */}
                        <button>Retry</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default FindingMatch;
