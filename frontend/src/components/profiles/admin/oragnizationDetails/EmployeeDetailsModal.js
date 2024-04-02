import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const EmployeeDetailsModal = ({ show, handleClose, employee }) => {
  const [projects, setProjects] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsAndManagers = async () => {
      try {
        const projectsResponse = await axios.get(`http://127.0.0.1:8000/employee-projects/${employee.id}/`);
        setProjects(projectsResponse.data.projects);
        setManagers(projectsResponse.data.managers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects and managers:', error);
        setLoading(false);
      }
    };

    if (show && employee) {
      fetchProjectsAndManagers();
    }
  }, [show, employee]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Employee Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h5>Projects:</h5>
            <ul>
              {projects.map(project => (
                <li key={project.id}>{project.title}</li>
              ))}
            </ul>
            <h5>Managers:</h5>
            <ul>
              {managers.map(manager => (
                <li key={manager.id}>{manager.name}</li>
              ))}
            </ul>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeDetailsModal;
