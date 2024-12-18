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
  const [loading, setLoading] = useState(false); // Loader state

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

    // Show confirmation dialog before proceeding
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to allocate this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, allocate it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post("/api/admin/add-task", data);
        console.log("Response:", response.data);

        // Success Alert
        Swal.fire({
          title: "Success!",
          text: "Task allocated successfully!",
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
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  return (
    <div className="alloc-container">
      <h2 className="alloc-heading">Task Submission Allocation</h2>
      {loading ? (
        <div className="loader-container">
          {/* Loader component */}
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
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
            <label className="alloc-label">Week:</label>
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
      )}
    </div>
  );
};

export default TaskAllocation;
