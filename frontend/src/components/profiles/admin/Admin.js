import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomNavbar from '../../../layouts/navbars/AdminNavBar';
import LeaveTable from './tables/LeaveTable';
import { Dropdown } from 'react-bootstrap';
import EmployeeTable from './oragnizationDetails/EmployeeTable';
import ProjectTable from './oragnizationDetails/ProjectTable';
import ManagerTable from './oragnizationDetails/ManagerTable';
import LeaveTypeManagement from './LeavesTypes';
import IconMenu from './IconMenu';
import '../../../styles/admin.css';
import { bottom } from '@popperjs/core';

function Admin() {
    const [leaveApply, setleaveApply] = useState([]);
    const [selectedLeaveApplication, setSelectedLeaveApplication] = useState(null);
    const [managerLeave, setManagerLeave] = useState([]);
    const [selectedManagerLeave, setSelectedManagerLeave] = useState(null);
    const locate = useLocation();
    const navigate = useNavigate();
    const [superuser, setSuperuser] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [isManTableOpen, setIsManTableOpen] = useState(false);
    const [isEmployeeTableOpen, setIsEmployeeTableOpen] = useState(false);
    const [isProjectTableOpen, setIsProjectTableOpen] = useState(false);
    const [isManagerTableOpen, setIsManagerTableOpen] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/');
        }
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/all-leave-application/');
                setleaveApply(response.data);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        const fetchManagerLeave = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/manager-leave-all/');
                setManagerLeave(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };

        const superuserValue = sessionStorage.getItem('superuser');
        if (superuserValue) {
            setSuperuser(superuserValue === 'true');
        }

        fetchData();
        fetchManagerLeave();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('token');
        navigate('/');
    };

    const handleViewDetails = (leaveApplication) => {
        setSelectedLeaveApplication(leaveApplication);
        setIsTableOpen(true);
        const modal = new window.bootstrap.Modal(document.getElementById('employeeDetailsModal'));
        modal.show();
    };

    const handleManagerDetails = (leaveApplication) => {
        setSelectedManagerLeave(leaveApplication);
        setIsTableOpen(true);
        const modal = new window.bootstrap.Modal(document.getElementById('managerDetailsModal'));
        modal.show();
    };

    const handleCloseTable = () => {
        setIsTableOpen(false);
        setIsManTableOpen(false);
    };

    const handleCloseManTable = () => {
        setIsManTableOpen(false);
        setIsTableOpen(false);

    };


    const handleManagerAction = async (action, leaveAppId) => {
        try {
            const res = await axios.patch(`http://127.0.0.1:8000/leaveapplication/${leaveAppId}/`, {
                action: action,
            });

            setleaveApply(prevleaveApply => {
                const updatedleaveApply = prevleaveApply.map(leaveApp => {
                    if (leaveApp.id === leaveAppId) {
                        return res.data;
                    }
                    return leaveApp;
                });
                console.log(res.data)
                return updatedleaveApply;
            });
        } catch (error) {
            console.error('Error updating leave application:', error.response.data);
        }
    };
    const handleLeaveAction = async (action, leaveAppId) => {
        try {
            const resonse = await axios.patch(`http://127.0.0.1:8000/manager-leave/${leaveAppId}/`, {
                action: action,
            });
            setManagerLeave(prevleaveApply => {
                const updatedleaveApply = prevleaveApply.map(leaveApp => {
                    if (leaveApp.id === leaveAppId) {
                        return resonse.data;
                    }
                    return leaveApp;
                });
                return updatedleaveApply;
            });
        } catch (error) {
            console.error('Error updating leave application:', error.response.data);
        }
    };


    const handleOptionChange = (option) => {
        setSelectedOption(option);
        setIsTableOpen(true);
        setIsManTableOpen(true);
    };
    const handleSignup = () => {
        navigate('/register');
    }
    const handleClick = () => {
        navigate('/projects');
    }
    const handleChoose = (option) => {
        setSelectedOption(option);
        setIsEmployeeTableOpen(false);
        setIsProjectTableOpen(false);
    };
    // organization details table
    const handleCloseEmployeeTable = () => {
        setIsEmployeeTableOpen(true);
    };
    const handleCloseProjectTable = () => {
        setIsProjectTableOpen(true);
    };
    const handleCloseManagerTable = () => {
        setIsManagerTableOpen(true);
    };



    return (
        <>
            <div className='container-fluid'>
                <div className='container-fluid'>
                    <CustomNavbar />
                </div>

                <IconMenu>
                    {/* Dropdown for Leave Applications */}
                    <Dropdown onOptionSelect={handleOptionChange} style={{paddingBottom:'6%'}}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Open Leave Applications
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleOptionChange('employee')}>Employee Leaves</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleOptionChange('manager')}>Manager Leaves</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Dropdown for Organization Details */}
                    <Dropdown onOptionSelect={handleChoose}>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Open Organization Details
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleChoose('employees')}>Employee</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleChoose('managers')}>Manager</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleChoose('projects')}>Project</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Buttons */}
                    <button className="btn btn-danger controls-btn" onClick={handleSignup}>
                        Create a new user
                    </button>
                    <button className="btn btn-success controls-btn" onClick={handleClick}>
                        Create project
                    </button>
                    <LeaveTypeManagement superuser={superuser} />
                </IconMenu>

                {/* Conditional rendering of tables based on selected option */}
                {selectedOption === 'employee' && isTableOpen && (
                    <>
                        <LeaveTable leaveData={leaveApply} handleAction={handleManagerAction} handleViewDetails={handleViewDetails} leaveType="employee" />
                        <button className="btn btn-danger" onClick={handleCloseTable}>Close Table</button>
                    </>
                )}
                {selectedOption === 'manager' && isManTableOpen && (
                    <>
                        <LeaveTable leaveData={managerLeave} handleAction={handleLeaveAction} handleViewDetails={handleManagerDetails} leaveType="manager" />
                        <button className="btn btn-danger" onClick={handleCloseManTable}>Close Table</button>
                    </>
                )}

                {/* Bootstrap Modal for Employee Details */}
                <div className="modal fade" id="employeeDetailsModal" tabIndex="-1" aria-labelledby="employeeDetailsModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="employeeDetailsModalLabel">Leave Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Name: {selectedLeaveApplication?.employee_name}</p>
                                <p>Email: {selectedLeaveApplication?.employee_email}</p>
                                {selectedLeaveApplication?.manager_name && selectedLeaveApplication?.manager_email && (
                                    <>
                                        <p>Manager Name: {selectedLeaveApplication.manager_name}</p>
                                        <p>Manager Email: {selectedLeaveApplication.manager_email}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bootstrap Modal for Manager Details */}
                <div className="modal fade" id="managerDetailsModal" tabIndex="-1" aria-labelledby="managerDetailsModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="managerDetailsModalLabel">Manager Leave Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>Name: {selectedManagerLeave?.manager_name}</p>
                                <p>Email: {selectedManagerLeave?.manager_email}</p>
                                {/* Add other details as needed */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {!isEmployeeTableOpen && selectedOption === 'employees' && (
                <div>
                    <button className='bg-dark bg-gradient text-white fw-bold ' onClick={handleCloseEmployeeTable}
                    style={{position: 'absolute', top:'25%' , right:'4%' , padding:'7px' , borderRadius:'15px' , width:'8%'}}
                    >CLOSE</button>
                    <EmployeeTable />
                </div>
            )}
            {!isProjectTableOpen && selectedOption === 'projects' && (
                <div>
                    <button className='bg-dark bg-gradient text-white fw-bold ' onClick={handleCloseProjectTable}
                    style={{position: 'absolute', top:'25%' , right:'4%' , padding:'7px' , borderRadius:'15px' , width:'8%'}}
                    >CLOSE</button>
                    <ProjectTable />
                </div>
            )}
            {!isManagerTableOpen && selectedOption === 'managers' && (
                <div>
                    <button className='bg-dark bg-gradient text-white fw-bold ' onClick={handleCloseManagerTable}
                    style={{position: 'absolute', top:'25%' , right:'4%' , padding:'7px' , borderRadius:'15px' , width:'8%'}}
                    >CLOSE</button>
                    <ManagerTable />
                </div>
            )}
        </>
    );
}

export default Admin;