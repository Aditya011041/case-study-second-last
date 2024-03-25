import React from 'react';
import { Modal } from 'react-bootstrap';

const LeaveApplicationDetailsModal = ({ showModal, selectedApplication, handleClose }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Leave Application Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedApplication && (
          <div>
            <p><strong>Employee Name:</strong> {selectedApplication.employee_name}</p>
            <p><strong>Leave Type:</strong> {selectedApplication.leave_type_name}</p>
            <p><strong>Start Date:</strong> {selectedApplication.start_date}</p>
            <p><strong>End Date:</strong> {selectedApplication.end_date}</p>
            <p><strong>Status:</strong> {selectedApplication.status}</p>
            <p><strong>Reason:</strong> {selectedApplication.reason}</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default LeaveApplicationDetailsModal;
