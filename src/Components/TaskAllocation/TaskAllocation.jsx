import React, { useState } from "react";
import axios from "../../axiosConfig";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./TaskAllocation.css"; // Link to the CSS file

const TaskAllocation = () => {
  const [batchnumber, setBatchnumber] = useState("");
  const [link, setLink] = useState("");
  const [task, setTask] = useState("");
  const [sem, setSem] = useState("");
  const [allocDate, setAllocDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      batchnumber: parseInt(batchnumber),
      link,
      task: parseInt(task),
      sem: parseInt(sem),
      allocDate,
      endDate,
    };

    try {
      const response = await axios.post("/api/admin/add-task", data);
      console.log("Response:", response.data);

      // Success Alert
      Swal.fire({
        title: "Success!",
        text: "Task Allocated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset alloc Fields
      setBatchnumber("");
      setLink("");
      setTask("");
      setSem("");
      setAllocDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error submitting task:", error);

      // Error Alert
      Swal.fire({
        title: "Error!",
        text: "Failed to submit the task. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="alloc-container">
      <h2 className="alloc-heading">Task Submission alloc</h2>
      <form onSubmit={handleSubmit} className="alloc">
        <div className="alloc-group">
          <label className="alloc-label">Batch Number:</label>
          <input
            type="number"
            className="alloc-input"
            value={batchnumber}
            onChange={(e) => setBatchnumber(e.target.value)}
            required
          />
        </div>
        <div className="alloc-group">
          <label className="alloc-label">Link:</label>
          <input
            type="url"
            className="alloc-input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div className="alloc-group">
          <label className="alloc-label">Task:</label>
          <input
            type="number"
            className="alloc-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
        </div>
        <div className="alloc-group">
          <label className="alloc-label">Semester:</label>
          <input
            type="number"
            className="alloc-input"
            value={sem}
            onChange={(e) => setSem(e.target.value)}
            required
          />
        </div>
        <div className="alloc-group">
          <label className="alloc-label">Allocation Date:</label>
          <input
            type="datetime-local"
            className="alloc-input"
            value={allocDate}
            onChange={(e) => setAllocDate(e.target.value)}
            required
          />
        </div>
        <div className="alloc-group">
          <label className="alloc-label">End Date:</label>
          <input
            type="datetime-local"
            className="alloc-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="alloc-button">
          Allocate Task
        </button>
      </form>
    </div>
  );
};

export default TaskAllocation;
