import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomNavbar from '../../../layouts/navbars/AdminNavBar';
import LeaveTypeManagement from './LeavesTypes';
import LeaveTable from './tables/LeaveTable';

function Admin() {
    const [leaveApplications, setLeaveApplications] = useState([]);
    const [selectedLeaveApplication, setSelectedLeaveApplication] = useState(null);
    const [managerLeave, setManagerLeave] = useState([]);
    const [selectedManagerLeave, setSelectedManagerLeave] = useState(null);
    const locate = useLocation();
    const navigate = useNavigate();
    const [superuser, setSuperuser] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [isTableOpen, setIsTableOpen] = useState(false);
    const [isManTableOpen, setIsManTableOpen] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/all-leave-application/');
                setLeaveApplications(response.data);
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
        setIsTableOpen(true);
        setIsManTableOpen(false);
    };
    
    const handleCloseManTable = () => {
        setIsManTableOpen(true);
        setIsTableOpen(false);

    };
    

    const handleManagerAction = async (action, leaveAppId) => {
        try {
            const res = await axios.patch(`http://127.0.0.1:8000/leaveapplication/${leaveAppId}/`, {
                action: action,
            });
            const resonse = await axios.patch(`http://127.0.0.1:8000/manager-leave/${leaveAppId}/`, {
                action: action,
            });

            setLeaveApplications(prevLeaveApplications => {
                const updatedLeaveApplications = prevLeaveApplications.map(leaveApp => {
                    if (leaveApp.id === leaveAppId) {
                        return res.data;
                    }
                    return leaveApp;
                });
                return updatedLeaveApplications;
            });
            setManagerLeave(prevLeaveApplications => {
                const updatedLeaveApplications = prevLeaveApplications.map(leaveApp => {
                    if (leaveApp.id === leaveAppId) {
                        return resonse.data;
                    }
                    return leaveApp;
                });
                return updatedLeaveApplications;
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
            setManagerLeave(prevLeaveApplications => {
                const updatedLeaveApplications = prevLeaveApplications.map(leaveApp => {
                    if (leaveApp.id === leaveAppId) {
                        return resonse.data;
                    }
                    return leaveApp;
                });
                return updatedLeaveApplications;
            });
        } catch (error) {
            console.error('Error updating leave application:', error.response.data);
        }
    };


    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };
    const handleSignup = () => {
        navigate('/register');
    }

    return (
        <>
            <div className='container-fluid'>
                <div className='container-fluid'>
                    <CustomNavbar />
                </div>

                <div>

                    <div className="dropdown" style={{ marginBottom: '20px' }}>
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            Open Leave Applications
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button className="dropdown-item" onClick={() => handleOptionChange('employee')}>Employee Leaves</button></li>
                            <li><button className="dropdown-item" onClick={() => handleOptionChange('manager')}>Manager Leaves</button></li>
                        </ul>
                    </div>

                    {/* Conditional rendering of tables based on selected option */}
                    {selectedOption === 'employee' && !isTableOpen && (
                        <>
                            <LeaveTable leaveData={leaveApplications} handleAction={handleManagerAction} handleViewDetails={handleViewDetails} leaveType="employee" />
                            <button className="btn btn-danger" onClick={handleCloseTable}>Close Table</button>
                        </>
                    )}
                    {selectedOption === 'manager' && !isManTableOpen && (
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

                    <LeaveTypeManagement superuser={superuser} />
                    <button className="btn btn-danger" onClick={handleSignup}>
                      Creat a new user   
                    </button>

                </div>
            </div>
        </>
    );
}

export default Admin;
