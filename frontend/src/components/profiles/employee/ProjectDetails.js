import React, { useState, useEffect } from 'react';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import { Navbar, Nav, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import '../../../styles/empProjectFilterBar.css';

const ProjectDetails = ({ emp }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log(emp.employee.id)
    setProjects(emp.projects);
    setTotalPages(emp.pagination.total_pages);
  }, [emp.projects, emp.pagination]);

  const getManagerNamesForProject = (project) => {
    return project.managers.map(managerId => {
      const manager = emp.managers.find(manager => manager.id === managerId);
      return manager ? manager.name : '';
    });
  };

  const handlePageChange = async (pageNumber, searchTerm = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/emp/${emp.employee.id}/?page=${pageNumber}&project_name=${searchTerm}`);
      setProjects(response.data.projects);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // If the search field is cleared, fetch the data without filtering
    if (value === '') {
      handlePageChange(1); // Pass 1 as the page number and an empty string as the search term
    } else {
      // If the search field is not empty, fetch the data with the new search term
      handlePageChange(1, value); // Pass the current page and the new search term
    }
  };
  
  
  
  useEffect(() => {
    console.log(`searchTerm updated: ${searchTerm}`);
  }, [searchTerm , currentPage]);
  return (
    <>
      <h2 className='mt-3 text-primary fs-1 fw-bold' style={{ marginLeft: '18rem', display: 'flex', justifyContent: 'flex-start' }}>Project Details</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {projects.map((project) => (
          <div key={project.id} style={{ flex: '0 0 50%', maxWidth: '50%', padding: '10px' }}>
            <div className="card p-2" style={{ width: '100%' }}>
              <div className="card-body p-3">
                <ListGroup.Item className='fs-5' style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <p><span className='fs-4 fw-bold text-danger'>Project Name</span> -<span className='fw-bold text-success'> {project.title}</span></p>
                </ListGroup.Item>
                <ListGroup.Item style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <p><span className='text-primary fw-bold'>Project Desc</span> - <span className='text-secondary fw-bold'> {project.description}</span></p>
                </ListGroup.Item>
                <ListGroup.Item>
                  <p className='fw-bold text-danger' style={{ display: 'flex', justifyContent: 'start' }}>Managers:</p>
                  <ListGroup>
                    {getManagerNamesForProject(project).map((managerName, index) => (
                      <ListGroup.Item key={index} style={{ display: 'flex', justifyContent: 'start' }} className='text-success fw-bold'>
                        <span className='px-2 text-dark'>{index + 1}.</span> {managerName}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              </div>
            </div>
          </div>
        ))}
      </div>
        <div>
      <input  className='filterbar' type="text" value={searchTerm} onChange={handleSearch} placeholder="Search by project name" />
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          {[...Array(totalPages).keys()].map((number) => (
            <li key={number} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(number + 1)}>{number + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default ProjectDetails;
