import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/pictures/pic.jpg';

export default function LeaveApplicationForm() {

    const [leaveType, setLeaveType] = useState([]);
    const [empId, setEmpId] = useState(null);
    const location = useLocation();
    const emp_email = location.state?.employeeEmail
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaveType = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/leaveTypeDetail/');
                setLeaveType(response.data);
            } catch (error) {
                console.error('Error fetching leave type:', error);
            }
        }

        const getAllEmp = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/emp/');
                setEmpId(response.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
            }
        }

        fetchLeaveType()
        getAllEmp()
    }, []);
    const [data, setData] = useState({
        employee: emp_email,
        leave_type: '',
        start_date: '',
        end_date: '',
        status: 'pending',
        reason: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };


    const handleLeaveTypeChange = (e) => {
        const { value } = e.target;
        setData({
            ...data,
            leave_type: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in data) {
            if (data[key] === '') {
                alert('Please fill all fields.');
                return;
            }
        }

        // Check for valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.employee)) {
            alert('Please enter a valid email address.');
            return;
        }

        //  if leave type is selected
        if (data.leave_type === '') {
            alert('Please select a leave type.');
            return;
        }

        // if start date is before end date
        if (data.start_date > data.end_date) {
            alert('Start date must be before end date.');
            return;
        }

        const selectedEmployee = empId.find(employee => employee.email === data.employee);
        if (selectedEmployee) {
            data.employee = selectedEmployee.id.toString();
        }

        try {
            const res = await axios.post(`http://127.0.0.1:8000/leaveapplicationlist/${data.employee}/`, data);
            navigate('/detail', { state: { emp_id: data.employee } });
        } catch (error) {
            alert(error.response.data.error);
            console.error('Error posting leave application:', error.response.data);
        }

        setData({
            employee: '',
            leave_type: '',
            start_date: '',
            end_date: '',
            status: 'pending',
            reason: '',
        });
    }

    const today = new Date().toISOString().split('T')[0];
    const getNextDay = (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate());
        return nextDay.toISOString().split('T')[0];
    };



    return (
        <>
            <section className="vh-150 gradient-custom" style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: "center", backgroundSize: 'cover' }}>
                <div className="container py-2 h-100" >
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-12 col-lg-9 col-xl-7">
                            <div className="card shadow-lg p-4 p-md-5 rounded-3" style={{ background: 'linear-gradient(to right, #6f42c1, #20c997)' }}>
                                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Leave Application Form</h3>
                                <form onSubmit={handleSubmit} method="POST">
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputEmail1" className="form-label fw-bold">Employee Email</label>
                                        <input type="email" className="form-control form-control-lg" name='employee' value={emp_email} readOnly />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputType1" className="form-label fw-bold">Leave Type</label>
                                        <select className="form-select form-select-lg" onChange={handleLeaveTypeChange}>
                                            <option defaultValue>Select leave type</option>
                                            {leaveType.map((leave) => (
                                                <option key={leave.id} value={leave.id}>{leave.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputDate1" className="form-label fw-bold">Start Date</label>
                                        <input type="date" className="form-control form-control-lg" name="start_date" onChange={handleChange} value={data.start_date} min={today} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputDate1" className="form-label fw-bold">End Date</label>
                                        <input type="date" className="form-control form-control-lg" name="end_date" onChange={handleChange} value={data.end_date} min={data.start_date ? getNextDay(data.start_date) : today} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="exampleInputType1" className="form-label fw-bold"></label>
                                        <input type="text" className="form-control form-control-lg" name='reason' value={data.reason} onChange={handleChange} />
                                    </div>
                                    <div className="mt-4 pt-2">
                                        <button type="submit" className="btn btn-primary btn-lg">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}






