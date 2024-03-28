import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Modal } from 'react-bootstrap';
import Pagination from 'react-js-pagination';

const ManagerTable = () => {
    const [managers, setManagers] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(3);
    const [managerEmployees, setManagerEmployees] = useState([]);
    const [managerProjects, setManagerProjects] = useState([]);
  
    useEffect(() => {
      const fetchManagers = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/manager/');
          setManagers(response.data);
        } catch (error) {
          console.error('Error fetching managers:', error);
        }
      };
  
      fetchManagers();
    }, []);
  
    const handleCloseEmployeeModal = () => {
      setShowEmployeeModal(false);
    };
  
    const handleCloseProjectModal = () => {
      setShowProjectModal(false);
    };
  
    const handleViewEmployees = async (manager) => {
      setSelectedManager(manager);
      setShowEmployeeModal(true);
  
      // Fetch employees related to this manager
      try {
        const response = await axios.get(`http://127.0.0.1:8000/manager/${manager.id}/`);
        setManagerEmployees(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching manager employees:', error);
      }
    };
  
    const handleViewProjects = async (manager) => {
        setSelectedManager(manager);
        setShowProjectModal(true);
      
        // Fetch projects related to this manager
        try {
          const response = await axios.get(`http://127.0.0.1:8000/manager/${manager.id}/`);
          setManagerProjects(response.data);
        } catch (error) {
          console.error('Error fetching manager projects:', error);
        }
      };
  
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    const filteredManagers = managers.filter((manager) =>
      manager.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    // Get current managers
    const indexOfLastManager = currentPage * itemsPerPage;
    const indexOfFirstManager = indexOfLastManager - itemsPerPage;
    const currentManagers = filteredManagers.slice(indexOfFirstManager, indexOfLastManager);
  
    return (
      <>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' , position:'absolute' , top:'15%' , right:'3%' , padding:'10px' , borderRadius:'10px' , outline:'none' }}
        />
  
        <Table
          striped
          bordered
          hover
          style={{ maxWidth: '600px', border: '1px solid #dee2e6', borderRadius: '5px', marginLeft: '30%' }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Employees</th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {currentManagers.map((manager) => (
              <tr key={manager.id}>
                <td>{manager.name}</td>
                <td>{manager.email}</td>
                <td>
                  <Button variant="info" onClick={() => handleViewEmployees(manager)}>
                    View Employees
                  </Button>
                </td>
                <td>
                  <Button variant="info" onClick={() => handleViewProjects(manager)}>
                    View Projects
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
  
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={filteredManagers.length}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            itemClass="page-item" // Custom class for pagination buttons
            linkClass="page-link" // Custom class for pagination links
          />
        </div>
  
        {/* Modal for Employee View */}
        <Modal show={showEmployeeModal} onHide={handleCloseEmployeeModal}>
  <Modal.Body>
    {managerEmployees && (
      <>
        <h5>{selectedManager ? `Employees under ${selectedManager.name}:` : ''}</h5>
        <ul>
          { managerEmployees.employees && managerEmployees.employees.map((employee) => (
            <li key={employee.id}>{employee.name}</li>
          ))}
        </ul>
      </>
    )}
  </Modal.Body>
</Modal>

<Modal show={showProjectModal} onHide={handleCloseProjectModal}>
  <Modal.Body>
    {managerProjects && (
      <>
        <h5>{selectedManager ? `Projects managed by ${selectedManager.name}:` : ''}</h5>
        <ul>
          { managerProjects.projects_under_manager && managerProjects.projects_under_manager.map((project) => (
            <li key={project.id} style={{padding:'2%'}}>
              <div><strong> Title </strong>: {project.title}</div>
              <div><strong> Description </strong>: {project.description}</div>
              <div><strong> Other Managers </strong>: {project.manager_names.join(', ')}</div>
            </li>
          ))}
        </ul>
      </>
    )}
  </Modal.Body>
</Modal>

      </>
    );
  };
  
  export default ManagerTable;
  