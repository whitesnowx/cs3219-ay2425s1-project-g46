// Author(s): Xue ling
import "./styles/CodeEditor.css";
import { useEffect, useRef, useState } from "react";
import socket from "../pages/collaboration-service/utils/socket";
import Editor from "@monaco-editor/react";
import supportedLanguages from "../data/supportedLanguages.json";

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("", "");
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("javascript", "");

  useEffect(() => {
    console.log(roomId);
    socket.on("receiveCode", ({ code }) => {
      setCode(code);
    });

    socket.on("languageChange", ({ language }) => {
      setLanguage(language);
    });

    return () => {
      socket.off("receiveCode");
      socket.off("languageChange");
    };
  }, [code]);

  function handleEditorChange(code, event) {
    setCode(code);
    socket.emit("sendCode", { roomId, code });
  }

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setLanguage(language);
    socket.emit("languageChange", { roomId, language });
  };

  return (
    <div id="editor-container" className="container">
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="">--Please choose a language--</option>
        {supportedLanguages.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Editor
        height="100vh"
        language={language}
        defaultValue={"// your code here"}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          minimap: {
            enabled: true,
            renderCharacters: true, // Show characters in the minimap
          },
        }}
      />
    </div>
  );
};

export default CodeEditor;
