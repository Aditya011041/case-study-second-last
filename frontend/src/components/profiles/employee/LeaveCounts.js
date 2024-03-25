import React from 'react';

const LeaveCounts = ({ leaveCounts }) => {
    return (
         <div className="leave-counts" style={{marginRight:'50%'}}>
                <h2 className='text-warning fs-1 fw-bold mt-4'>Leave Counts</h2>
                <div>
                    {Object.keys(leaveCounts.leave_types).map(leaveTypeId => (
                        <div key={leaveTypeId} className="card p-3 mt-5 leave-counts-card">
                            <div className="card-body">
                                <h5 className="card-title">Leave Type: {leaveCounts.leave_types[leaveTypeId].name}</h5>
                                <p className="card-text">Total Available: {leaveCounts.leave_types[leaveTypeId].total_available}</p>
                                <p className="card-text">Total Used: {leaveCounts.leave_types[leaveTypeId].total_used}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div> 
    );
};

export default LeaveCounts;
