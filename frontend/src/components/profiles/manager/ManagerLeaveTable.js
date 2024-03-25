import React from 'react';

const ManagerLeaveTable = ({ leaveApplications }) => {
  return (
    <div className='mt-4'>
      <h2 className='text-warning fs-1 fw-bold leave-applications-title'>Leave Applications</h2>
      <div className='p-3 leave-applications-table'>
        <table className="table align-middle mb-0">
          <thead className="bg-light">
            <tr>
              <th>Manager Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveApplications.map((leaveApp) => (
              <tr key={leaveApp.id}>
                <td>{leaveApp.manager_name}</td>
                <td>{leaveApp.leave_type}</td>
                <td>{leaveApp.start_date}</td>
                <td>{leaveApp.end_date}</td>
                <td>{leaveApp.status}</td>
                {/* <td className='bg-info'>
                  <button className='bg-info fw-bold' style={{ border: 'none', color: 'red' }} onClick={() => handleManagerAction('cancel', leaveApp.id)}>Cancel</button>
                </td>
                <td>
                  <button className='p-1 bg-success' onClick={() => handleViewDetails(leaveApp)}>View</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerLeaveTable;
