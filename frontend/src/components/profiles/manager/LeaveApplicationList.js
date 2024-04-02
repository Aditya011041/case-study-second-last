import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/managerProfileLeaveList.css';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const LeaveApplicationList = ({ managerId }) => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [selectedLeaveApplication, setSelectedLeaveApplication] = useState(null);

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/leaveapplicationlist/manager/${managerId}`);
        setLeaveApplications(response.data);
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      }
    };
    fetchLeaveApplications();
  }, [managerId]);

  const handleViewDetails = (leaveApplication) => {
    setSelectedLeaveApplication(leaveApplication);
    const modal = new window.bootstrap.Modal(document.getElementById('employeeDetailsModal'));
    modal.show();
  };

  const handleManagerAction = async (action, leaveAppId) => {
    try {
      // Make a PATCH request to update the leave application with the manager's action
      const res = await axios.patch(`http://127.0.0.1:8000/leaveapplicationlist/manager/${managerId}/${leaveAppId}/`, {
        action: action,
        is_ui_decision: true,
      });
  
      // Extract relevant data from the response
      const { manager_decision, leave_application: updatedLeaveApplication } = res.data;
      console.log('updated', updatedLeaveApplication);
  
      // Update the UI with the updated leave application data
      setLeaveApplications(prevLeaveApplications => {
        return prevLeaveApplications.map(leaveApp => {
          if (leaveApp.id === updatedLeaveApplication.id) {
            return {
              ...leaveApp,
              ...updatedLeaveApplication,
              manager_decision: manager_decision,
            };
          }
          return leaveApp;
        });
      });
  
      // Send a notification to the employee about the manager's action
      await sendNotificationToEmployee(leaveAppId, managerId, action ,`Manager ${managerId} ${action} your leave application.`);
  
      // Alert the user about the success of the manager's action
      alert(`Leave application ${action} successfully.`);
  
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      alert('An error occurred while processing your request.');
    }
  };
  
  const sendNotificationToEmployee = async (leaveApplicationId, managerId,action, message) => {
    try {
      // Make a POST request to send a notification to the employee
      await axios.post('http://127.0.0.1:8000/leave-action-notification/', {
        leave_application_id: leaveApplicationId,
        manager_id: managerId,
        message: message,
        action: action,
      });
    } catch (error) {
      // Handle errors
      console.error('Error sending notification to employee:', error);
      alert('An error occurred while sending a notification to the employee.');
    }
  };
  
 
  
  const getStatusLabel = (leaveApp) => {

    if (leaveApp.status === 'REJECTED') {
      return 'Rejected';
    } else if (leaveApp.manager_statuses && leaveApp.manager_statuses.length > 0) {
      // Find the decision made by the current manager
      const managerDecision = leaveApp.manager_statuses.find(decision => decision.id === managerId); 
      if (managerDecision) {
        return managerDecision.action;
      }
    } else if (leaveApp.employee_view_status) {
      return leaveApp.employee_view_status;
    }
    return 'Pending'; // Default status if no decision is found
  };
  
  
  

  return (
    <div>
      <div className='leave-application-table'>
        <table className="table align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Leave Type</th>
              <th>Action</th>
              <th>Status</th>
              <th>View Details</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leaveApp) => (
              <tr key={leaveApp.id}>
                <td>{leaveApp.employee_name}</td>
                <td>{leaveApp.start_date}</td>
                <td>{leaveApp.end_date}</td>
                <td>{leaveApp.leave_type_name}</td>
                <td>
                  <div className="dropdown leave-application-actions">
                    <DropdownButton
                      id={`dropdownMenuButton${leaveApp.id}`}
                      title="Actions"
                      variant="secondary"
                      disabled={
                        leaveApp.final_rejection_manager !== null &&
                        leaveApp.final_rejection_manager !== managerId &&
                        leaveApp.manager_statuses[managerId] === 'REJECTED'
                      }
                    >
                      <Dropdown.Item
                        onClick={() => handleManagerAction('approve', leaveApp.id)}
                        disabled={
                          leaveApp.status === 'REJECTED' ||
                          (leaveApp.status === 'PENDING' && leaveApp.final_rejection_manager !== null && leaveApp.final_rejection_manager !== managerId)
                        }
                      >
                        Approve
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleManagerAction('reject', leaveApp.id)}
                        disabled={leaveApp.status === 'REJECTED'}
                      >
                        Reject
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handleManagerAction('pending', leaveApp.id)}
                        disabled={leaveApp.status === 'REJECTED'}
                      >
                        Leave Pending
                      </Dropdown.Item>
                    </DropdownButton>

                  </div>
                </td>
                <td className="leave-application-status">
                  {leaveApp.superuser_changed_status ? (
                    <span>Admin Decided</span>
                  ) : (
                    <span>{getStatusLabel(leaveApp)}</span>
                  )}
                </td>
                <td>
                  <button className='bg-secondary px-2 fw-bold text-warning' style={{ borderRadius: '10px' }} onClick={() => handleViewDetails(leaveApp)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="employeeDetailsModal" tabIndex="-1" aria-labelledby="employeeDetailsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title leave-application-modal-title" id="employeeDetailsModalLabel">
                Employee Details
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body leave-application-modal-body">
              <p>Name: {selectedLeaveApplication?.employee_name}</p>
              <p>Email: {selectedLeaveApplication?.employee_email}</p>
              <p>Leave Type: {selectedLeaveApplication?.leave_type_name}</p>
              <p>Start Date: {selectedLeaveApplication?.start_date}</p> 
              <p>End Date: {selectedLeaveApplication?.end_date}</p>
              <p>Reason: {selectedLeaveApplication?.reason  }</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationList;
