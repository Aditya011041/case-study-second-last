import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import '../../../styles/leaves.css';
import LeaveCounts from './LeaveCounts';
import EmployeeLeaveApplicationDetail from './EmployeeLeaveApplicationDetail';
import LeaveApplicationDetailsModal from './LeaveApplicationDetailsModal';
import bellIcon from '../../../assets/pictures/bell.png'; // Import the bell icon
import '../../../styles/employeeToggleBar.css';
import '../../../styles/employeeNotifications.css';

const LeaveApplications = ({ emp, empApplication, leaveCounts, leaveApply, handleAction, id }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showLeaveCounts, setShowLeaveCounts] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [filterStatus, setFilterStatus] = useState('ALL'); // Default filter status
    const [showNotificationModal, setShowNotificationModal] = useState(false); // State for notification modal

    useEffect(() => {
        fetchNotifications(); // Fetch notifications when component mounts
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/employee-notification/${id}/`);
            const data = await response.json();
            setNotifications(data);
            console.log(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCancel = (appId, status) => {
        if (status === 'APPROVED' || status === 'REJECTED') {
            alert(`Cannot cancel leave application as it is already ${status.toLowerCase()}.`);
        } else {
            handleAction(appId);
        }
    };

    const handleClearNotifications = async () => {
        try {
            await fetch(`http://127.0.0.1:8000/employee-notification/${id}/`, {
                method: 'DELETE'
            });
            setNotifications([]); 
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };

    const filterStatuses = ['ALL', 'APPROVED', 'REJECTED', 'CANCELLED', 'PENDING'];

    return (
        <div>
            {/* Apply for leave button */}
            <button className='m-2 p-2 leave-applications-container' onClick={leaveApply}>Apply For Leave</button>

            {/* Toggle bars */}
            <div className="toggle-bars m-3 p-1">
                {filterStatuses.map(status => (
                    <button
                        style={{ borderRadius: '4px', margin: '0.2%' }}
                        key={status}
                        className={`toggle-bar ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Employee leave application details */}
            {!showLeaveCounts && (
    <EmployeeLeaveApplicationDetail
        empApplication={empApplication.filter(app => filterStatus === 'ALL' || app.status === filterStatus)}
        handleCancel={handleCancel}
        handleViewDetails={handleViewDetails}
    />
)}


            {/* Modal for leave application details */}
            <LeaveApplicationDetailsModal
                showModal={showModal}
                selectedApplication={selectedApplication}
                handleClose={() => {
                    setSelectedApplication(null);
                    setShowModal(false);
                }}
                notifications={notifications}
            />

            {/* Notification bell icon */}
            <img src={bellIcon} alt="Bell" className="bell-icon" onClick={() => setShowNotificationModal(true)} />
            {notifications.length >= 0 && <span className="badges text-white">{notifications.length}</span>}

            {/* Notification modal */}
            <Modal show={showNotificationModal} onHide={() => setShowNotificationModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {notifications.map(notification => (
                            <ListGroup.Item key={notification.id}>
                                {notification.message}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNotificationModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClearNotifications}>
                        Clear Notifications
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Show/hide leave counts button */}
            <Button className="m-2 p-2 leave-container text-black" onClick={() => setShowLeaveCounts(!showLeaveCounts)}>
                {showLeaveCounts ? 'Hide Leave Counts' : 'Show Leave Counts'}
            </Button>

            {/* Leave counts */}
            {showLeaveCounts && <LeaveCounts leaveCounts={leaveCounts} />}
        </div>
    );
};

export default LeaveApplications;
