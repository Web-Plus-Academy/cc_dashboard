import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";
import Swal from "sweetalert2";
import "./TaskCreditUpdate.css";

const TaskCreditUpdate = () => {
    const [batchNumber, setBatchNumber] = useState(""); // To filter batch-wise data
    const [tasks, setTasks] = useState([]); // List of tasks fetched from the backend
    const [selectedTask, setSelectedTask] = useState(null); // For assigning credit to a specific task
    const [credit, setCredit] = useState(""); // Credit value for a task
    const [creditFilter, setCreditFilter] = useState(""); // For filtering
    const [selectedSemester, setSelectedSemester] = useState(""); // Semester filter
    const [submissionFilter, setSubmissionFilter] = useState(""); // Submission status filter
    const [searchQuery, setSearchQuery] = useState(""); // Search input
    const [sortBy, setSortBy] = useState(""); // Sorting option
    const [isLoading, setIsLoading] = useState(false); // Loading spinner
    const [page, setPage] = useState(1); // Pagination
    const pageSize = 50; // Number of tasks per page

    // Fetch tasks and semester projects by batch
    useEffect(() => {
        if (batchNumber) {
            fetchTasks(batchNumber);
        }
    }, [batchNumber]);

    const fetchTasks = async (batch) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/admin/tasks/${batch}`);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch tasks. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Assign credit to a specific task
    const handleAssignCredit = async () => {
        if (!selectedTask || credit === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please select a task and enter credit.",
            });
            return;
        }

        try {
            await axios.put("/api/admin/assignCredit", {
                batchnumber: batchNumber,
                sem: selectedTask.sem,
                taskId: selectedTask.taskId,
                newCredit: parseInt(credit),
            });

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Credit assigned successfully!",
            });

            // Refresh tasks
            fetchTasks(batchNumber);
            setSelectedTask(null);
            setCredit(""); // Clear input field
        } catch (error) {
            console.error("Error assigning credit:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to assign credit. Please try again later.",
            });
        }
    };


    // Handle data export as CSV
    const handleExportData = () => {
        const csvContent =
            "data:text/csv;charset=utf-8," +
            ["Student Name,Semester,Task ID,Credit,Submission Status"]
                .concat(
                    tasks.map(
                        (task) =>
                            `${task.studentName},${task.sem},${task.taskId},${task.credit},${task.isSubmitted ? "Submitted" : "Not Submitted"
                            }`
                    )
                )
                .join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "tasks.csv");
        document.body.appendChild(link);
        link.click();
    };

    // Filter, search, and sort tasks
    const filteredTasks = tasks
        .filter(
            (task) =>
                (selectedSemester ? task.sem === selectedSemester : true) &&
                (submissionFilter
                    ? submissionFilter === "submitted"
                        ? task.isSubmitted
                        : !task.isSubmitted
                    : true) &&
                (creditFilter === "-1" ? task.credit === -1 : true) && // Use creditFilter here
                (searchQuery
                    ? task.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.taskId.includes(searchQuery)
                    : true)
        )
        .sort((a, b) => {
            if (sortBy === "name") return a.studentName.localeCompare(b.studentName);
            if (sortBy === "semester") return a.sem - b.sem;
            if (sortBy === "credit") return b.credit - a.credit;
            return 0;
        })
        .slice((page - 1) * pageSize, page * pageSize);


    return (
        <div className="task-manager-container">
            <h2 className="task-manager-heading">Task Manager</h2>

            {/* Filters */}
            <div className="filters">
                <div className="form-group">
                    <label className="form-label">Select Batch:</label>
                    <select
                        value={batchNumber}
                        onChange={(e) => setBatchNumber(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- Select Batch --</option>
                        <option value="1">Batch 1</option>
                        <option value="2">Batch 2</option>
                        <option value="3">Batch 3</option>
                        <option value="4">Batch 4</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Filter by Semester:</label>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- Select Semester --</option>
                        {['sem1', 'sem2', 'sem3'].map((sem) => (
                            <option key={sem} value={sem}>
                                {sem.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="form-group">
                    <label className="form-label">Submission Status:</label>
                    <select
                        value={submissionFilter}
                        onChange={(e) => setSubmissionFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- Submission Status --</option>
                        <option value="submitted">Submitted</option>
                        <option value="not-submitted">Not Submitted</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Search:</label>
                    <input
                        type="text"
                        placeholder="Search by Name or Task ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Sort By:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- Sort By --</option>
                        <option value="name">Student Name</option>
                        <option value="semester">Semester</option>
                        <option value="credit">Credit</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Filter by Credit:</label>
                    <select
                        value={creditFilter}
                        onChange={(e) => setCreditFilter(e.target.value)}
                        className="form-select"
                    >
                        <option value="">-- All Credits --</option>
                        <option value="-1">Credit: -1</option>
                    </select>
                </div>;

            </div>


            {/* Display Tasks */}
            {isLoading ? (
                <div className="spinner">Loading...</div>
            ) : filteredTasks.length > 0 ? (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Semester</th>
                            <th>Week</th>
                            <th>Allocation</th>
                            <th>Deadline</th>
                            {/* <th>Task ID</th> */}
                            <th>Task Link</th>
                            <th>Status</th>
                            <th>Submitted</th>
                            <th>Credit</th>
                            <th>Assign Credit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((task) => (
                            <tr key={task.taskId}>
                                <td>{task.studentName}</td>
                                <td>{task.sem}</td>
                                <td>{task.task}</td>
                                {/* <td>{task.taskId}</td> */}
                                <td>
                                    {task.allocDate ? (
                                        // Create a new Date object and format it
                                        (() => {
                                            const date = new Date(task.allocDate);
                                            const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
                                            const year = date.getFullYear(); // Full year
                                            const hours = String(date.getHours()).padStart(2, '0'); // Hours with leading zero
                                            const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
                                            const seconds = String(date.getSeconds()).padStart(2, '0'); // Seconds with leading zero

                                            return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
                                        })()
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>
                                    {task.endDate ? (

                                        (() => {
                                            const date = new Date(task.endDate);
                                            const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
                                            const year = date.getFullYear(); // Full year
                                            const hours = String(date.getHours()).padStart(2, '0'); // Hours with leading zero
                                            const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
                                            const seconds = String(date.getSeconds()).padStart(2, '0'); // Seconds with leading zero

                                            return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
                                        })()
                                    ) : (
                                        "-"
                                    )}
                                </td>

                                <td>
                                    {task.livelink ? (
                                        <>
                                            <a href={task.gitlink} target="_blank" rel="noreferrer">
                                                Git Link
                                            </a>
                                            <br />
                                            <a href={task.livelink} target="_blank" rel="noreferrer">
                                                Live Link
                                            </a>

                                        </>
                                    ) : task.taskSubmitted ? (
                                        // If taskSubmitted exists, render the View Submission link
                                        <a href={task.taskSubmitted} target="_blank" rel="noreferrer">
                                            View
                                        </a>
                                    ) : (
                                        // If neither semproj nor taskSubmitted exists, display a dash
                                        "-"
                                    )}
                                </td>

                                {/* <td onClick={()=>{console.log(task.isSubmitted)}}>{task.isSubmitted}</td> */}
                                <td >{task.isSubmitted ? "Submitted" : "Not Submitted"}</td>
                                <td onClick={() => { console.log(task) }} >
                                    {task.submittedTime ? (
                                        // Create a new Date object and format it
                                        (() => {
                                            const date = new Date(task.submittedTime);
                                            const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
                                            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero
                                            const year = date.getFullYear(); // Full year
                                            const hours = String(date.getHours()).padStart(2, '0'); // Hours with leading zero
                                            const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutes with leading zero
                                            const seconds = String(date.getSeconds()).padStart(2, '0'); // Seconds with leading zero

                                            return `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
                                        })()
                                    ) : (
                                        "-"
                                    )}
                                </td>
                                <td>{task.credit}</td>
                                <td>
                                    <button
                                        onClick={() => setSelectedTask(task)}
                                        className="assign-credit-button"
                                    >
                                        Assign Credit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-tasks-message">No tasks available for the selected filters.</p>
            )}

            {/* Pagination */}
            <div className="pagination-controls">
                <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={filteredTasks.length < pageSize}
                >
                    Next
                </button>
            </div>

            {/* Export Button */}
            <button onClick={handleExportData} className="export-button">
                Export as CSV
            </button>

            {/* Credit Input Modal */}
            {selectedTask && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Assign Credit for Task {selectedTask.taskId}</h3>
                        <input
                            type="number"
                            placeholder="Enter Credit"
                            value={credit}
                            onChange={(e) => setCredit(e.target.value)}
                        />
                        <button onClick={handleAssignCredit}>Assign</button>
                        <button onClick={() => setSelectedTask(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCreditUpdate;
