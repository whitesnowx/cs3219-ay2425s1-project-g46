// Author(s): Xue ling
import "./styles/CodeEditor.css";
import { useEffect, useRef, useState } from "react";
import socket from "../pages/collaboration-service/utils/socket";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("", "");
  const editorRef = useRef(null);

  useEffect(() => {
    console.log(roomId);
    socket.on("receiveCode", ({ code }) => {
      setCode(code);
    });

    return () => {
      socket.off("receiveCode");
    };
  }, [code]);

  function handleEditorChange(code, event) {
    setCode(code);
    socket.emit("sendCode", { roomId, code });
  }

  return (
    <div id="editor-container" className="container">
      <Editor
        height="100vh"
        language={"javascript"}
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
