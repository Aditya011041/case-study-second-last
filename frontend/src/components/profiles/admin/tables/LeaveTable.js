import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';

function LeaveTable({ leaveData, handleAction, handleViewDetails, leaveType }) {
  return (
    <div className='p-3' style={{ marginLeft: '25%', width: "52%" }}>
      <table className="table align-middle mb-0" style={{ padding: '2px', borderCollapse: 'collapse', width: '100%' }}>
        {/* Table header */}
        <thead className="bg-light" style={{ borderTop: '4px solid ', padding: '8px' }}>
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
          {/* Table rows */}
          {leaveData.map((leaveApp) => (
            <tr key={leaveApp.id}>
              <td style={{ borderLeft: '2px solid #7312b4', borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveType === 'employee' ? leaveApp.employee_name : leaveApp.manager_name}</td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.start_date}</td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.end_date}</td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveType === 'employee' ? leaveApp.leave_type_name : leaveApp.leave_type}</td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id={`dropdownMenuButton${leaveApp.id}`}>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='drop'>
                    <Dropdown.Item onClick={() => handleAction('approve', leaveApp.id)}>Approve</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAction('reject', leaveApp.id)}>Reject</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAction('pending', leaveApp.id)}>Leave Pending</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                {leaveApp.status}
              </td>
              <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                <button className='bg-info' onClick={() => handleViewDetails(leaveApp)}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveTable;
