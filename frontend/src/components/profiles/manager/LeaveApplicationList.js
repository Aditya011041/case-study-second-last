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
      const res = await axios.patch(`http://127.0.0.1:8000/leaveapplicationlist/manager/${managerId}/${leaveAppId}/`, {
      action: action,
      is_ui_decision: true,
    });
    console.log(res.data);

    const updatedLeaveApplication = res.data.leave_application;
    const managerName = res.data.manager_name;

    setLeaveApplications(prevLeaveApplications => {
      return prevLeaveApplications.map(leaveApp => {
        if (leaveApp.id === updatedLeaveApplication.id) {
          return {
            ...leaveApp,
            ...updatedLeaveApplication,
            manager_decision: managerDecision,
            manager_name: managerName,
          };
        }
        return leaveApp;
      });
    });

      const managerDecision = res.data.manager_decision;

      console.log('Manager decision:', managerDecision);

      if (managerDecision && managerDecision.manager_id && managerDecision.decision) {
        console.log('Manager ID:', managerDecision.manager_id);
        console.log('Decision:', managerDecision.decision);
      } else {
        console.error('Invalid manager decision:', managerDecision);
      }

      if (updatedLeaveApplication.status === 'REJECTED') {
        alert('Leave application already rejected by another manager. Further changes denied.');
      }
      // if (action === 'reject' || action === 'approve' || action === 'leave_pending') {
      //   alert('Leave application already rejected by another manager. Further changes denied.');
      // }
    } catch (error) {
      console.log(error)
      if (error.response.status === 404 && error.response.data.superuser_changed_status) {
        alert('Status changed by admin. Further changes denied.');
      } else if (error.response.status === 400 && error.response.data.error === 'Leave application already rejected. Further changes denied.') {
        alert('Leave application already rejected by another manager. Further changes denied.');
      } else {
        alert(error.response.data.error);
      }
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationList;
