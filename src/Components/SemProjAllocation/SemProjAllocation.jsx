import React, { useState } from "react";
import axios from "../../axiosConfig";
import Swal from "sweetalert2";
import "./SemProjAllocation.css"; // Link to the CSS file

const SemProjAllocation = () => {
  const [sem, setSem] = useState("");
  const [batchnumber, setBatchnumber] = useState("");
  const [link, setLink] = useState("");
  const [allocDate, setAllocDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      sem: parseInt(sem),
      batchnumber: parseInt(batchnumber),
      link,
      allocDate,
      endDate,
    };

    try {
      const response = await axios.post("/api/admin/sem-proj", data);
      console.log("Response:", response.data);

      Swal.fire({
        title: "Success!",
        text: "Sem Project allocated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset sem Fields
      setSem("");
      setBatchnumber("");
      setLink("");
      setAllocDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error submitting task:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to submit the task. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="sem-container">
      <h2 className="sem-heading">Sem Proj Allocation</h2>
      <form onSubmit={handleSubmit} className="sem">
        <div className="sem-group">
          <label className="sem-label">Semester:</label>
          <input
            type="number"
            className="sem-input"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
            required
          />
        </div>
        <div className="sem-group">
          <label className="sem-label">Batch Number:</label>
          <input
            type="number"
            className="sem-input"
            value={batchnumber}
            onChange={(e) => setBatchnumber(e.target.value)}
            required
          />
        </div>
        <div className="sem-group">
          <label className="sem-label">Link:</label>
          <input
            type="url"
            className="sem-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div className="sem-group">
          <label className="sem-label">Allocation Date:</label>
          <input
            type="datetime-local"
            className="sem-input"
            value={allocDate}
            onChange={(e) => setAllocDate(e.target.value)}
            required
          />
        </div>
        <div className="sem-group">
          <label className="sem-label">End Date:</label>
          <input
            type="datetime-local"
            className="sem-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="sem-button">
        Allocate Project
        </button>
      </form>
    </div>
  );
};

export default SemProjAllocation;
