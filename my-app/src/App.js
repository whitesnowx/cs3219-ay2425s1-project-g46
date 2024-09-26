import './App.css';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test from './pages/Test';
import Question from './pages/Question';
import View from './pages/View';

/**
 * 
 * Main application, sets up routing. 
 * Uses react-router-dom to manage navigation between different pages.
 */
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Question />} />
      <Route path="/Test" element={<Test />} />
      <Route path="/view/:id" element={<View />} />
    </Routes>
  </Router>
  );
}

export default App;
