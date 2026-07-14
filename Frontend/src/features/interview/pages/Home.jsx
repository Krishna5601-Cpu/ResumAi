import React from "react";
import "../style/home.scss";

const Home = () => {
  return (
    <main className="home">
      <div className="interview-input-group"></div>
      <div className="left">
        <textarea
          name="jobDescription"
          id="jobDescription"
          placeholder="Enter Your Job Description Here....."
        ></textarea>
      </div>

      <div className="right">
        <div className="input-group">
          <label className="file-label" htmlFor="resume">
            Upload Resume...
          </label>
          <input hidden type="file" name="resume" id="resume" accept=".pdf" />
        </div>

        <div className="input-group">
          <label htmlFor="selfDescription">Self Description</label>
          <textarea
            name="selfDescription"
            id="selfDescription"
            placeholder="Describe your self in few sentences..."
          ></textarea>
        </div>
        <button className="generate-btn">
          Generate Button Interview Report
        </button>
      </div>
    </main>
  );
};

export default Home;
