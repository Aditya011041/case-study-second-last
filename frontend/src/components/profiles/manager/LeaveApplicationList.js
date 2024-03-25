import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ('bootstrap');

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
      });
      console.log(res);
      
      const managerDecision = res.data.manager_decision;

      console.log('Manager decision:', managerDecision);
  
      // Now you can access properties of managerDecision object
      if (managerDecision && managerDecision.manager_id && managerDecision.decision) {
        console.log('Manager ID:', managerDecision.manager_id);
        console.log('Decision:', managerDecision.decision);
      } else {
        console.error('Invalid manager decision:', managerDecision);
      }
      
      setLeaveApplications(prevLeaveApplications => {
        const updatedLeaveApplications = prevLeaveApplications.map(leaveApp => {
          if (leaveApp.id === leaveAppId) {
            return res.data;
          }
          return leaveApp;
        });
        return updatedLeaveApplications;
      });
    } catch (error) {
      if (error.response.status === 404 && error.response.data.superuser_changed_status) {
        alert('Status changed by admin. Further changes denied.');
      } else {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div>
      <div className='p-3' style={{ marginLeft: '25%', width: "52%" }}>
        <table className="table align-middle mb-0" style={{ padding: '2px', borderCollapse: 'collapse', width: '100%' }}>
          <thead className="bg-light" style={{ borderTop: '4px solid #7312b4', padding: '8px' }}>
            <tr>
              <th style={{ borderLeft: '4px solid #7312b4', borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>Name</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>Start Date</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>End Date</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>Leave Type</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>Action</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>Status</th>
              <th style={{ borderRight: '4px solid #7312b4', borderBottom: '4px solid #7312b4', padding: '8px' }}>View Details</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leaveApp) => (
              <tr key={leaveApp.id}>
                <td style={{ borderLeft: '2px solid #7312b4', borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.employee_name}</td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.start_date}</td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.end_date}</td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.leave_type_name}</td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id={`dropdownMenuButton${leaveApp.id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true" defaultValue>
                      Actions
                    </button>
                    <ul className="dropdown-menu dropdown-menu-right " aria-labelledby={`dropdownMenuButton${leaveApp.id}`} style={{overflow:'visible'}}>
                      <li><button className="dropdown-item" onClick={() => handleManagerAction('approve', leaveApp.id)}>Approve</button></li>
                      <li><button className="dropdown-item" onClick={() => handleManagerAction('reject', leaveApp.id)}>Reject</button></li>
                      <li><button className="dropdown-item" onClick={() => handleManagerAction('pending', leaveApp.id)}>Leave Pending</button></li>
                    </ul>
                  </div>
                </td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                  
                  {leaveApp.superuser_changed_status ? (
                    <span> Admin Decided</span>
                  ) : (<>
                   <span>{leaveApp.status} </span> 
                   </>
                  ) }
                </td>
                <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                  <button className='bg-info' onClick={() => handleViewDetails(leaveApp)}>View Details</button>
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
              <h5 className="modal-title" id="employeeDetailsModalLabel">Employee Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
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
