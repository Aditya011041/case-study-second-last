import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import '../../../styles/leaves.css';
import LeaveCounts from './LeaveCounts';
import EmployeeLeaveApplicationDetail from './EmployeeLeaveApplicationDetail';
import LeaveApplicationDetailsModal from './LeaveApplicationDetailsModal';
import '../../../styles/employeeToggleBar.css';

const LeaveApplications = ({ emp, empApplication, leaveCounts, leaveApply, handleAction }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showLeaveCounts, setShowLeaveCounts] = useState(false);
    const [filterStatus, setFilterStatus] = useState('ALL'); // Default filter status

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCancel = (appId, status) => {
        if (status === 'APPROVED') {
            alert("Cannot cancel leave application as it is already approved.");
        } else if (status === 'REJECTED') {
            alert("Cannot cancel leave application as it is already rejected.");
        } else {
            handleAction(appId);
        }
    };

    // Filter applications based on filterStatus
    const filteredApplications = empApplication.filter(application => {
        if (filterStatus === 'ALL') return true;
        const applicationViewStatus = application.employee_view_status.toUpperCase();
        const filterStatusUpper = filterStatus.toUpperCase(); 
        return applicationViewStatus === filterStatusUpper;
    });
    
    
console.log('Filtering application:', filteredApplications);

    return (
        <div>
            <button className='m-2 p-2 leave-applications-container' onClick={leaveApply}>Apply For Leave</button>
            <div className="toggle-bars">
                {['ALL', 'APPROVED', 'REJECTED', 'CANCELLED', 'PENDING'].map(status => (
                    <button
                        key={status}
                        className={`toggle-bar ${filterStatus === status ? 'active' : ''}`}
                        onClick={() => setFilterStatus(status)}
                    >
                        {status}
                       


                    </button>
                ))}
            </div>
            {!showLeaveCounts && (
                <EmployeeLeaveApplicationDetail
                    empApplication={filteredApplications}
                    handleCancel={handleCancel}
                    handleViewDetails={handleViewDetails}
                />
            )}
            <LeaveApplicationDetailsModal
                showModal={showModal}
                selectedApplication={selectedApplication}
                handleClose={() => {
                    setSelectedApplication(null);
                    setShowModal(false);
                }}
            />
            <Button className="m-2 p-2 leave-container text-black" onClick={() => setShowLeaveCounts(!showLeaveCounts)}>
                {showLeaveCounts ? 'Hide Leave Counts' : 'Show Leave Counts'}
            </Button>
            {showLeaveCounts && <LeaveCounts leaveCounts={leaveCounts} />}
        </div>
    );
};

export default LeaveApplications;
