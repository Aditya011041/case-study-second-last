import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backgroundImage from '../../../assets/pictures/pic.jpg';
import { useNavigate } from 'react-router-dom';

export default function ProjectsForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to: [],
        managers: [],
    });
    const [employees, setEmployees] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/emp/');
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        const fetchManagers = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/manager/');
                setProjectManagers(response.data);
            } catch (error) {
                console.error('Error fetching project managers:', error);
            }
        };

        fetchEmployees();
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
            setFormData({
                ...formData,
                [name]: value,
            });


        
    };
    

    const handleSelectChange = (e) => {
        const { name, options } = e.target;
        const selectedItems = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedItems.push(options[i].value); // Only push the value (ID)
                console.log(selectedItems);
            }
            // console.log(selectedItems);
        }
        setFormData({
            ...formData,
            [name]: selectedItems,
        });
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post('http://127.0.0.1:8000/projects/', formData);
            navigate('/');
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <section className="vh-100 d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-lg p-4 p-md-5 rounded-3" style={{ background: 'linear-gradient(to right, #6f42c1, #20c997)' }}>
                            <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 text-center text-white">Create Project</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label fw-bold text-white">Title</label>
                                    <input type="text" className="form-control form-control-lg" id="title" name="title" value={formData.title} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label fw-bold text-white">Description</label>
                                    <textarea className="form-control form-control-lg" id="description" name="description" value={formData.description} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="assignedTo" className="form-label fw-bold text-white">Assigned To</label>
                                    <select multiple className="form-control form-control-lg" id="assigned_to" name="assigned_to" value={formData.assigned_to} onChange={handleSelectChange}>
                                        {employees.map(employee => (
                                            <option key={employee.id} value={employee.id}>{employee.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="managers" className="form-label fw-bold text-white">Managers</label>
                                    <select multiple className="form-control form-control-lg" id="managers" name="managers" value={formData.managers} onChange={handleSelectChange}>
                                        {projectManagers.map(manager => (
                                            <option key={manager.id} value={manager.id}>{manager.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mt-4 pt-2">
                                    <button type="submit" className="btn btn-primary btn-lg">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
