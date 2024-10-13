// Author(s): Andrew
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/Select.css";
import NavBar from "../../components/NavBar";

function FindingMatch() {
  

  return (
    <div >
      <NavBar />
      <div id="MatchingController">
        <label>Matching in progress....</label>
        <label>Timer</label>
        <button>Cancel</button>
      </div>

    </div>
  )
}

export default FindingMatch