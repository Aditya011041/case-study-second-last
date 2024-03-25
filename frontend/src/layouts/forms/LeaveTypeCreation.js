import React, { useState } from 'react';
import axios from 'axios';

export default function LeaveTypeModal({ showModal, onClose }) {
    const [leaveType, setLeaveType] = useState({
        name: '',
        days_allocated: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveType({ ...leaveType, [name]: value });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!leaveType.name || !leaveType.days_allocated) { 
            alert('Please enter a name and days allocated ')
            return; // added return statement to exit the function if fields are empty
        }
    
        try {
            await axios.post('http://127.0.0.1:8000/leaveTypeDetail/', leaveType);
            alert('New leave type created successfully!');
            onClose(); // Close the modal after successful submission
            setLeaveType({
                name: '',
                days_allocated: ''
            });
        } catch (error) {
            console.error('Error creating leave type:', error);
            alert('Failed to create new leave type. Please try again.');
        }
    };

    return (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' , position:'absolute' , top:'20%' , left:'30%'}}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Leave Type</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input  type="text" id="name" name="name" value={leaveType.name} onChange={handleChange} className="form-control bg-info" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="days_allocated">Days Allocated:</label>
                                <input type="number" id="days_allocated" name="days_allocated" value={leaveType.days_allocated} onChange={handleChange} className="form-control bg-info" />
                            </div>
                            <button type="submit" className="m-4">
                            <div  class="btn-flip" data-back="Submit" data-front="On Me!"></div>
                                </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
