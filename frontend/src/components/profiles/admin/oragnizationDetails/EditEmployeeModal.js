import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditEmployeeModal = ({ show, handleClose, employee, handleUpdateEmployee }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        position: '',
    });

    // Update formData when the employee prop changes
    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        handleUpdateEmployee(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton={show} onHide={handleClose}>
                <Modal.Title>Edit Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formDepartment">
                        <Form.Label>Department</Form.Label>
                        <Form.Control type="text" name="department" value={formData.department} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formPosition">
                        <Form.Label>Position</Form.Label>
                        <Form.Control type="text" name="position" value={formData.position} onChange={handleChange} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEmployeeModal;
