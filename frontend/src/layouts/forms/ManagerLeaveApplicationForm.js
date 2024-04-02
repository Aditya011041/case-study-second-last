import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/managerLeaveForm.css'

const ManagerLeaveApplicationForm = ({ managerId }) => {
    const [formData, setFormData] = useState({
        manager: managerId,
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const [leaveTypes, setLeaveTypes] = useState([]);

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/leaveTypeDetail/');
                setLeaveTypes(response.data);
                console.log('leave', response.data)
                console.log(leaveTypes.id)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('real', formData)
          const formDataCopy = { ...formData, leave_type: parseInt(formData.leave_type) };
          console.log('copy', formDataCopy)
            const response = await axios.post(`http://127.0.0.1:8000/manager-leave-create/${managerId}/`, formDataCopy);
            console.log('Leave application submitted successfully:', response.data);
            // Handle successful submission
        } catch (error) {
            console.error('Error submitting leave application:', error.response.data);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="leave-application-form-wrapper">
          <div className="leave-application-form-container">
            <label htmlFor="number" className="leave-application-form-label">Manager ID:</label>
            <input type="number" id="number" name="number" value={managerId} readOnly className="leave-application-form-input" />
          </div>
          <div className="leave-application-form-container">
            <label htmlFor="leaveType" className="leave-application-form-label">Leave Type:</label>
            <select id="leaveType" name="leave_type" value={formData.leave_type} onChange={handleChange} className="leave-application-form-input">
              <option value="">Select leave type</option>
              {leaveTypes.map(leaveType => (
                <option key={leaveType.id} value={leaveType.id}>{leaveType.name}</option>
              ))}
            </select>
          </div>
          <div className="leave-application-form-container">
            <label htmlFor="startDate" className="leave-application-form-label">Start Date:</label>
            <input type="date" id="startDate" name="start_date" value={formData.start_date} onChange={handleChange} className="leave-application-form-input" />
          </div>
          <div className="leave-application-form-container">
            <label htmlFor="endDate" className="leave-application-form-label">End Date:</label>
            <input type="date" id="endDate" name="end_date" value={formData.end_date} onChange={handleChange} className="leave-application-form-input" />
          </div>
          <div className="leave-application-form-container">
            <label htmlFor="reason" className="leave-application-form-label">Reason:</label>
            <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="4" className="leave-application-form-input" />
          </div>
          <button type="submit" className="leave-application-form-button">Submit</button>
        </form>
      );
};

export default ManagerLeaveApplicationForm;
