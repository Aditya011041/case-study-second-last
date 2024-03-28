import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import yesImage from '../../../assets/pictures/yes.png';
import noImage from '../../../assets/pictures/no.png';
import loaderImage from '../../../assets/pictures/loader.svg'; // Import the loader image
import  {  useEffect } from 'react';

const LeaveApplicationDetailsModal = ({ showModal, selectedApplication, handleClose }) => {
  const [showManagerModal, setShowManagerModal] = useState(false);

  const handleManagerDetailsClick = () => {
    setShowManagerModal(true);
  };

  const getStatus = (application) => {
    // if (application.status === 'APPROVED') {
    //   return 'Approved';
    // } 
     if (application.manager_statuses.some(manager => manager.action === 'APPROVE')) {
      application.employee_view_status = 'Approved'; // Update employee view status
      return 'Approved';
    } else if (application.employee_view_status === 'REJECTED' || application.employee_view_status === 'CANCELLED') {
      return application.employee_view_status;
    } else {
      return 'Pending'; // Default status if no decision is found
    }
  };



  return (
    <>
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
              <p>
                <strong>Status:</strong> {getStatus(selectedApplication)}
              </p>
              <p><strong>Reason:</strong> {selectedApplication.reason}</p>
              <Button variant="primary" onClick={handleManagerDetailsClick}>Manager Details</Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showManagerModal} onHide={() => setShowManagerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Managers' Decisions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {selectedApplication && selectedApplication.manager_statuses.map((managerStatus, index) => (
              <li key={index}>
                <strong>Name:</strong> {managerStatus.name}, &nbsp;
                <strong>Action:</strong> {
                  managerStatus.action === 'PENDING' ? (
                    <img src={loaderImage} alt="Loading.." style={{width:'46px'}} />
                  ) : managerStatus.action === 'APPROVE' ? (
                    <img src={yesImage} alt="Approved" style={{width:'20px'}}/>
                  ) : managerStatus.action === 'REJECT' ? (
                    <img src={noImage} alt="Rejected" style={{width:'20px'}}/>
                  ) : managerStatus.action
                }
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowManagerModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveApplicationDetailsModal;
