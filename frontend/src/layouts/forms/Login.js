import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/pictures/bg.jpg';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/login', {
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { emp_id, is_manager, manager_Id, token, superuser, message } = response.data;
            sessionStorage.setItem('token', token);

            if (superuser) {
                alert('You are logged in as an admin.');
                sessionStorage.setItem('admin bhai' , true);
                navigate('/admin', { state: { emp_id, token, superuser } });
            } 
            else if (is_manager) {
                alert(message);
                navigate('/manager-dashboard', { state: { manager_Id, token } });
            } else {
                alert(message);
                navigate('/detail', { state: { emp_id, token } });
            }
            if (response.data.first_login) {
                navigate('/new-password');
            }
            
            sessionStorage.setItem('isLoggedIn', 'true');

        } catch (error) {
            alert(error.response.data.error)
            console.error('Error:', error.message);
        }
    };

    const handleRegister = () => {
        navigate('/register');
    }
    // useEffect(() =>{
    //     const admin = sessionStorage.getItem('admin bhai');
    //     if (admin) {
    //         navigate('/projects');
    //     }
    // })

    return (
        <section className="vh-100" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col col-xl-10">
                        <div className="card" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                            <div className="row g-0">
                                <div className="col-md-6 col-lg-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img2.webp"
                                        alt="login form"
                                        className="img-fluid"
                                        style={{ borderRadius: '1rem 0 0 1rem' }}
                                    />
                                </div>
                                <div className="col-md-6 col-lg-7 d-flex align-items-center" style={{ backgroundColor: '#FFB6C1', borderRadius: '0 1rem 1rem 0' }}>
                                    <div className="card-body p-4 p-lg-5 text-black">
                                        <form onSubmit={handleSubmit}>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <i className="fas fa-cubes fa-2x me-3" style={{ color: '#ff6219' }}></i>
                                                <span className="h1 fw-bold mb-0">BeeHyv <span></span>
                                                    <span className='fs-2'>में आपका स्वागत है</span> </span>
                                            </div>
                                            <h5 className="fw-normal mb-3 pb-3" style={{ letterSpacing: '1px' }}>
                                                Sign into your account
                                            </h5>
                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="form2Example17">
                                                    Email address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="form2Example17"
                                                    className="form-control form-control-lg bg-muted"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="form2Example27">
                                                    Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="form2Example27"
                                                    className="form-control form-control-lg bg-muted"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="pt-1 mb-4 ">
                                                <button className="btn btn-dark btn-lg btn-block mx-3" type="submit">
                                                    Login
                                                </button>
                                                <button className="btn btn-dark btn-lg btn-block" type="submit" onClick={handleRegister}>
                                                    Sign Up
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
