import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.post(`http://127.0.0.1:8000/manager-leave-create/${managerId}/`, formData);
            console.log('Leave application submitted successfully:', response.data);
            // Handle successful submission
        } catch (error) {
            console.error('Error submitting leave application:', error.response.data);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem', background: 'linear-gradient(to right, #6f42c1, #20c997)', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', maxWidth: '500px', margin: 'auto' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="endDate" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manager id:</label>
            <input type="number" id="number" name="number" value={managerId} readOnly style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="leaveType" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Leave Type:</label>
            <select id="leaveType" name="leave_type" value={formData.leave_type} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="">Select leave type</option>
              {leaveTypes.map(leaveType => (
                <option key={leaveType.id} value={leaveType.id}>{leaveType.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="startDate" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Start Date:</label>
            <input type="date" id="startDate" name="start_date" value={formData.start_date} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="endDate" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>End Date:</label>
            <input type="date" id="endDate" name="end_date" value={formData.end_date} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reason" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Reason:</label>
            <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="4" style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ background: '#6f42c1', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>Submit</button>
        </form>
      );
      
};

export default ManagerLeaveApplicationForm;
