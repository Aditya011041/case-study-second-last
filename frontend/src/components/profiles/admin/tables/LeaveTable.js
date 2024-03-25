// LeaveTable.js

import React from 'react';

function LeaveTable({ leaveData, handleAction, handleViewDetails, leaveType }) {
    return (
        <div className='p-3' style={{ overflowX: 'auto', marginLeft: '25%', width: "52%" }}>
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
                    {leaveData.map((leaveApp) => (
                        <tr key={leaveApp.id}>
                            <td style={{ borderLeft: '2px solid #7312b4', borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveType === 'employee' ? leaveApp.employee_name : leaveApp.manager_name}</td>
                            <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.start_date}</td>
                            <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveApp.end_date}</td>
                            <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>{leaveType === 'employee' ? leaveApp.leave_type_name : leaveApp.leave_type}</td>
                            <td style={{ borderRight: '2px solid #7312b4', borderBottom: '2px solid #7312b4', padding: '8px' }}>
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id={`dropdownMenuButton${leaveApp.id}`} data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true" defaultValue>
                                        Actions
                                    </button>
                                    <ul className="dropdown-menu " aria-labelledby={`dropdownMenuButton${leaveApp.id}`}>
                                        <li><button className="dropdown-item" onClick={() => handleAction('approve', leaveApp.id)}>Approve</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleAction('reject', leaveApp.id)}>Reject</button></li>
                                        <li><button className="dropdown-item" onClick={() => handleAction('pending', leaveApp.id)}>Leave Pending</button></li>
                                    </ul>
                                </div>
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
