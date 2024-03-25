import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from '../../../assets/pictures/pic.jpg';
import { useNavigate } from 'react-router-dom';

export default function EmployeeSignupForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        position: '',
        payment: '',
        password: '',
        is_manager: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: val,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const key in formData) {
            if (formData[key] === '') {
                alert('Please fill all fields.');
                return;
            }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/emp/', formData);
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Handle validation errors
                alert('Please fill in all required fields.');
            } else {
                console.error('Error signing up:', error);
            }
        }
    };

    return (
        <section className="vh-150 d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg p-4 p-md-5 rounded-3" style={{ background: 'linear-gradient(to right, #6f42c1, #20c997)' }}>
                            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5">Employee Signup</h3>
                            <form onSubmit={handleSubmit} method="POST">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-bold">Name</label>
                                    <input type="text" className="form-control form-control-lg" id="name" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                                    <input type="email" className="form-control form-control-lg" id="email" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="department" className="form-label fw-bold">Department</label>
                                    <input type="text" className="form-control form-control-lg" id="department" name="department" value={formData.department} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="position" className="form-label fw-bold">Position</label>
                                    <input type="text" className="form-control form-control-lg" id="position" name="position" value={formData.position} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="payment" className="form-label fw-bold">Payment</label>
                                    <input type="number" className="form-control form-control-lg" id="payment" name="payment" value={formData.payment} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">Password</label>
                                    <input type="password" className="form-control form-control-lg" id="password" name="password" value={formData.password} onChange={handleChange} />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="is_manager" name="is_manager" checked={formData.is_manager} onChange={handleChange} />
                                    <label className="form-check-label" htmlFor="is_manager">Is Manager</label>
                                </div>
                                <div className="mt-4 pt-2">
                                    <button type="submit" className="btn btn-primary btn-lg">Signup</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
