import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function LeaveTypeEditModal({ showModal, onClose }) {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const selectRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '',
        days_allocated: ''
    });

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/leaveTypeDetail/');
                setLeaveTypes(response.data);
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        };

        fetchLeaveTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleLeaveTypeChange = (e) => {
        const selectedLeaveTypeId = e.target.value;
        const selectedLeaveType = leaveTypes.find(leaveType => leaveType.id === parseInt(selectedLeaveTypeId));
        setSelectedLeaveType(selectedLeaveType);
        setFormData({
            name: selectedLeaveType.name,
            days_allocated: selectedLeaveType.days_allocated.toString()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://127.0.0.1:8000/leaveTypeDetail/${selectedLeaveType.id}/`, formData);
            onClose();
            handleClose();
        } catch (error) {
            console.error('Error updating leave type:', error);
        }
    };

    const handleClose = () => {
        setSelectedLeaveType(null); // Reset selectedLeaveType to null
        setFormData({ // Clear the form data
            name: '',
            days_allocated: ''
        });
        if (selectRef.current) {
            selectRef.current.value = ''; // Reset the value of the <select> element
        }
        onClose(); // Close the modal
    };



    return (
        <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none', marginTop: '10%' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content" style={{ backgroundColor: '#ffa3a3' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Leave Type</h5>
                        <button type="button" className="close" onClick={handleClose}>
                            <span aria-hidden="false">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Select Leave Type:</label>
                                <select onChange={handleLeaveTypeChange} className="form-control" ref={selectRef}>
                                    <option value="">Select leave type</option>
                                    {leaveTypes.map(leaveType => (
                                        <option key={leaveType.id} value={leaveType.id}>{leaveType.name}</option>
                                    ))}
                                </select>
                            </div>
                            {selectedLeaveType && (
                                <>
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>Days Allocated:</label>
                                        <input type="number" name="days_allocated" value={formData.days_allocated} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
