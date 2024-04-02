import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

const EditProject = ({ project, onUpdate }) => {
    const [assignedEmployees, setAssignedEmployees] = useState([]);
    const [assignedManagers, setAssignedManagers] = useState([]);
    const [formData, setFormData] = useState({
        title: project.title,
        description: project.description,
        assignedEmployees: [],
        assignedManagers: []
    });
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [allEmployeesAndManagers, setAllEmployeesAndManagers] = useState({});
    const [modalType, setModalType] = useState('');

    useEffect(() => {
        fetchAssignedData();
    }, []);

    const fetchAssignedData = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/assigned-employees-and-managers/${project.id}/`);
            setAssignedEmployees(response.data.assigned_employees);
            setAssignedManagers(response.data.assigned_managers);
            setAllEmployeesAndManagers(response.data);
            setFormData(prevState => ({
                ...prevState,
                assignedEmployees: response.data.assigned_employees.map(emp => emp.id),
                assignedManagers: response.data.assigned_managers.map(mgr => mgr.id)
            }));
        } catch (error) {
            console.error('Error fetching assigned employees and managers:', error);
        }
    };

    const handleSelectModalOpen = (type) => {
        setShowSelectModal(true);
        setModalType(type);
    };

    const handleSelectModalClose = () => {
        setShowSelectModal(false);
    };

    const handleEmployeeSelection = (employee) => {
        setAssignedEmployees([...assignedEmployees, employee]);
        setFormData(prevState => ({
            ...prevState,
            assignedEmployees: [...prevState.assignedEmployees, employee.id]
        }));
    };

    const handleManagerSelection = (manager) => {
        setAssignedManagers([...assignedManagers, manager]);
        setFormData(prevState => ({
            ...prevState,
            assignedManagers: [...prevState.assignedManagers, manager.id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Remove the employee permanently from the project in the frontend
            const updatedFormData = {
                ...formData,
                assignedEmployees: assignedEmployees.map(emp => emp.id),
                assignedManagers: assignedManagers.map(mgr => mgr.id)
            };
            console.log('Updated form data:', updatedFormData); // Log updated form data
            setFormData(updatedFormData);
    
            // Send a request to update the project with the modified data
            const response = await axios.patch(`http://127.0.0.1:8000/edit-projects/${project.id}/`, updatedFormData);
            console.log(response.data); // Assuming response.data contains the updated project details
            onUpdate(); // Close the edit modal
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };
    
    
    const handleRemoveEmployee = async (employee) => {
        try {
            // Make a DELETE request to remove the employee from the project
            await axios.delete(`http://127.0.0.1:8000/delete-projects/${project.id}/${employee.id}/`);
            
            // Filter out the employee from assignedEmployees state
            const updatedAssignedEmployees = assignedEmployees.filter(emp => emp.id !== employee.id);
            setAssignedEmployees(updatedAssignedEmployees);
    
            // Also remove the employee from the formData
            setFormData(prevState => ({
                ...prevState,
                assignedEmployees: prevState.assignedEmployees.filter(id => id !== employee.id)
            }));
        } catch (error) {
            console.error('Error removing employee:', error);
        }
    };
    
    const handleRemoveManager = async (manager) => {
        try {
            // Make a DELETE request to remove the manager from the project
            await axios.delete(`http://127.0.0.1:8000/manager-delete-projects/${project.id}/${manager.id}/`);
            
            // Filter out the manager from assignedManagers state
            const updatedAssignedManagers = assignedManagers.filter(mgr => mgr.id !== manager.id);
            setAssignedManagers(updatedAssignedManagers);
            
            // Also remove the manager from the formData
            setFormData(prevState => ({
                ...prevState,
                assignedManagers: prevState.assignedManagers.filter(id => id !== manager.id)
            }));
        } catch (error) {
            console.error('Error removing manager:', error);
        }
    };

    return (
        <>
            <Modal show={true} onHide={onUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Project</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </Form.Group>
                        <h5>Assigned Employees:</h5>
                        <ListGroup>
                            {assignedEmployees.map(employee => (
                                <ListGroup.Item key={employee.id}>
                                    {employee.name}
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => handleRemoveEmployee(employee)}>
                                        X
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <Button variant="secondary" className="mt-3" onClick={() => handleSelectModalOpen('employees')}>
                            Add Employees
                        </Button>
                        <h5 className="mt-3">Assigned Managers:</h5>
                        <ListGroup>
                            {assignedManagers.map(manager => (
                                <ListGroup.Item key={manager.id}>
                                    {manager.name}
                                    <Button variant="danger" size="sm" className="ml-2" onClick={() => handleRemoveManager(manager)}>
                                        X
                                    </Button>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <Button variant="secondary" className="mt-3" onClick={() => handleSelectModalOpen('managers')}>
                            Add Managers
                        </Button>
                        <Button variant="primary" type="submit" className="mt-3" style={{marginLeft:'10%'}}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showSelectModal} onHide={handleSelectModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'employees' ? 'Select Employees' : 'Select Managers'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {modalType === 'employees' && allEmployeesAndManagers && allEmployeesAndManagers.all_employees && allEmployeesAndManagers.all_employees.map(employee => (
                            // Check if the employee is not in the assignedEmployees list
                            !assignedEmployees.some(emp => emp.id === employee.id) && (
                                <ListGroup.Item key={employee.id} action onClick={() => handleEmployeeSelection(employee)}>
                                    {employee.name}
                                </ListGroup.Item>
                            )
                        ))}
                        {modalType === 'managers' && allEmployeesAndManagers && allEmployeesAndManagers.all_managers && allEmployeesAndManagers.all_managers.map(manager => (
                            // Check if the manager is not in the assignedManagers list
                            !assignedManagers.some(mgr => mgr.id === manager.id) && (
                                <ListGroup.Item key={manager.id} action onClick={() => handleManagerSelection(manager)}>
                                    {manager.name}
                                </ListGroup.Item>
                            )
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleSelectModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditProject;
