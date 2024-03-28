import React from 'react';

const EmployeeLeaveApplicationDetail = ({ empApplication, handleCancel, handleViewDetails }) => {
  return (
    <div className='mt-4'>
      <h2 className='text-warning fs-1 fw-bold leave-applications-title'>Leave Applications</h2>
      <div className='p-3 leave-applications-table' >
        <table className="table align-middle mb-0" >
          <thead className="bg-light">
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {empApplication.map((app) => (
              <tr key={app.id}>
                <td>{app.employee_name}</td>
                <td>{app.leave_type_name}</td>
                <td>{app.start_date}</td>
                <td>{app.end_date}</td>
                <td>
                  {app.status === 'CANCELLED' ? app.status : (app.superuser_changed_status ? app.status : app.employee_view_status)}
                </td>
                <td className='bg-info'>
                  <button
                    className='bg-info fw-bold'
                    style={{ border: 'none', color: 'red' }}
                    onClick={() => handleCancel(app.id, app.status)}
                    disabled={app.status === 'CANCELLED'} // Disable cancel button if status is 'CANCELLED'
                  >
                    Cancel
                  </button>
                </td>
                <td>
                  <button className='p-1 bg-success' onClick={() => handleViewDetails(app)}>
                    View
                  </button>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeLeaveApplicationDetail;
