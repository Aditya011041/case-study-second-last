import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'react-bootstrap';
import Pagination from 'react-js-pagination';

const ProjectTable = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showManagerModal, setShowManagerModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
  
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/all-project/');
          setProjects(response.data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };
  
      fetchProjects();
    }, []);
  
    const handleCloseProjectModal = () => {
      setShowProjectModal(false);
    };
  
    const handleCloseManagerModal = () => {
      setShowManagerModal(false);
    };
  
    const handleViewProjects = (project) => {
      setSelectedProject(project);
      setShowProjectModal(true);
    };
  
    const handleViewManagers = (project) => {
      setSelectedProject(project);
      setShowManagerModal(true);
    };
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const filteredProjects = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Get current projects
    const indexOfLastProject = currentPage * itemsPerPage;
    const indexOfFirstProject = indexOfLastProject - itemsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  
    return (
      <>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' , position:'absolute' , top:'15%' , right:'3%' , padding:'10px' , borderRadius:'10px' , outline:'none' }}
        />
  
        <Table striped bordered hover style={{ maxWidth: '600px', border: '1px solid #dee2e6', borderRadius: '5px', marginLeft: '30%' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Projects</th>
              <th>Managers</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project) => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>{project.description}</td>
                <td>
                  <Button variant="info" onClick={() => handleViewProjects(project)}>
                    View More
                  </Button>
                </td>
                <td>
                  <Button variant="info" onClick={() => handleViewManagers(project)}>
                    View More
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        <div style={{ display: 'flex', justifyContent: 'center'  }}>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={itemsPerPage}
          totalItemsCount={filteredProjects.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item" // Custom class for pagination buttons
          linkClass="page-link" // Custom class for pagination links
        />
      </div>
      {/* Modal for assigned Projects */}
      <Modal show={showProjectModal} onHide={handleCloseProjectModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assigned Projects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {selectedProject && selectedProject.assigned_to_names.map(ProjectName => (
              <li key={ProjectName}>{ProjectName}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProjectModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for assigned managers */}
      <Modal show={showManagerModal} onHide={handleCloseManagerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assigned Managers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {selectedProject && selectedProject.manager_names.map(manager => (
              <li key={manager}>{manager}</li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseManagerModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectTable;
