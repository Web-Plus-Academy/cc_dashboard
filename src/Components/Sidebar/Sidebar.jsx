import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ adminDetails }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-box">
                <h4 className="sidebar-welcome">Welcome,</h4>
                <h1 className="sidebar-name">{adminDetails.name}</h1>
                <p className="sidebar-id">ID: {adminDetails.ID}</p>
            </div>
            <div className="sidebar-container">
                <button className="sidebar-container-button">
                    <NavLink className="sidebar-container-link" to="/dashboard">
                        Dashboard
                    </NavLink>
                </button>

                <br />
                <hr />
                <button className="sidebar-container-button">
                    <NavLink className="sidebar-container-link" to="/addStudent">
                        Add Student
                    </NavLink>
                </button>

                <br />
                <hr />

                <button className="sidebar-container-button">
                    <NavLink className="sidebar-container-link" to="/taskalloc">
                        Task Allocation
                    </NavLink>
                </button>
                <br />
                <hr />

                <button className="sidebar-container-button">
                    <NavLink className="sidebar-container-link" to="/semprojalloc">
                        SemProj Allocation
                    </NavLink>
                </button>
                <br />
                <hr />

                <button className="sidebar-container-button">
                    <NavLink className="sidebar-container-link" to="/taskcredit">
                        Credits assign
                    </NavLink>
                </button>
                <br />
                <hr />

            </div>
        </div>
    );
};

export default Sidebar;
