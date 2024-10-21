import { useLocation } from "react-router-dom";
import { useState } from "react";
import ContentEditor from "../../components/ContentEditor";
import CodeEditor from "../../components/CodeEditor";

import NavBar from "../../components/NavBar";
import QuestionPanel from "../../components/QuestionPanel";

const CollaborationPage = () => {
  const location = useLocation();
  const data = location.state.data;
  const { roomId, questionData } = data;
  const [activeTab, setActiveTab] = useState("code", "");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <NavBar />
      <QuestionPanel questionData={questionData} />

      <div className="tabs">
        <button
          onClick={() => handleTabChange("code")}
          className={activeTab == "code" ? "active" : ""}
        >
          Code
        </button>
        <button
          onClick={() => handleTabChange("content")}
          className={activeTab == "content" ? "active" : ""}
        >
          Text
        </button>
      </div>
      <div className="tab-content">
        {/* Render both components with inline styles for visibility control */}
        <div style={{ display: activeTab == "code" ? "block" : "none" }}>
          <CodeEditor roomId={roomId} />
        </div>
        <div style={{ display: activeTab == "content" ? "block" : "none" }}>
          <ContentEditor roomId={roomId} />
        </div>
      </div>
    </div>
  );
};

export default CollaborationPage;
