import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import '../../../styles/leaves.css';
import LeaveCounts from './LeaveCounts';
import EmployeeLeaveApplicationDetail from './EmployeeLeaveApplicationDetail';
import LeaveApplicationDetailsModal from './LeaveApplicationDetailsModal';

const LeaveApplications = ({ emp, empApplication, leaveCounts, leaveApply, handleAction }) => {
    console.log(leaveCounts);
    const [showModal, setShowModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showLeaveCounts, setShowLeaveCounts] = useState(false);

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowModal(true);
    };

    const handleCancel = (appId, status) => {
        if (status === 'APPROVED') {
            alert("Cannot cancel leave application as it is already approved.");
        } 
        if (status === 'REJECTED') {
            alert("Cannot cancel leave application as it is already rejected.");
        }
        else {
            handleAction(appId);
        }
    };
    const handleCloseModal = () => {
        setSelectedApplication(null);
        setShowModal(false);
      };

    return (
        <div>
            <button className='m-2 p-2 leave-applications-container' onClick={leaveApply}>Apply For Leave</button>
            {!showLeaveCounts && (
                <EmployeeLeaveApplicationDetail
                    empApplication={empApplication}
                    handleCancel={handleCancel}
                    handleViewDetails={handleViewDetails}
                />
            )}
            <LeaveApplicationDetailsModal
                showModal={showModal}
                selectedApplication={selectedApplication}
                handleClose={handleCloseModal}
            />
            <Button className="m-2 p-2 leave-container text-black" onClick={() => setShowLeaveCounts(!showLeaveCounts)}>
                {showLeaveCounts ? 'Hide Leave Counts' : 'Show Leave Counts'}
            </Button>
            {showLeaveCounts && <LeaveCounts leaveCounts={leaveCounts} />}


        </div>
    );
};

export default LeaveApplications;
