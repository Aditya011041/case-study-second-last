import React, { useState, useEffect } from 'react';
import { Carousel, Button } from 'react-bootstrap';
import axios from 'axios';
import '../../../styles/empProjectFilterBar.css';

const EmployeeDetails = ({ managers, count }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State to track current page
  const [totalPages, setTotalPages] = useState(1); // State to track total number of pages
  const [employees, setEmployees] = useState([]); // State to store employees array
  const [employeeProjects, setEmployeeProjects] = useState({}); // State to store individual projects for each employee
  const [filter, setFilter] = useState('');
  // Function to handle changing page
  const handlePageChange = async (pageNumber, search = '') => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/manager/${managers.manager.id}?page=${pageNumber}&employee_name=${search}`);
      setEmployees(response.data.employees); // Update employees data
      setCurrentPage(pageNumber);
  
      // Map individual projects to each employee
      const updatedEmployees = response.data.employees.map(employee => {
        const employeeProjects = response.data.individual_projects.find(project => project.employee_id === employee.id);
        return {
          ...employee,
          individualProjects: employeeProjects ? employeeProjects.projects : [] // Assign individual projects array to employee
        };
      });
  
      setEmployees(updatedEmployees);
      // Update employeeProjects state
      setEmployeeProjects(response.data.individual_projects.reduce((acc, project) => {
        acc[project.employee_id] = project.projects;
        return acc;
      }, {}));
  
      // Log the entire response data for debugging
      console.log('Response data:', response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  const handleSearch = (event) => {
    const { value } = event.target;
    setFilter(value);
    // If the search field is cleared, fetch the data without filtering
    if (value === '') {
      handlePageChange(1); // Pass 1 as the page number and an empty string as the search term
    } else {
      // If the search field is not empty, fetch the data with the new search term
      handlePageChange(1, value); // Pass the current page and the new search term
    }
  };
  



  useEffect(() => {
    setEmployees(managers.employees);
    setTotalPages(count);
  }, [managers.employees, managers.pagination]);

  // Load individual projects for each employee when the page changes
  useEffect(() => {
    const fetchEmployeesAndProjects = async (  filter = '') => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/manager/${managers.manager.id}?page=${currentPage}`);
        setEmployees(response.data.employees); // Update employees data
        setTotalPages(response.data.pagination.total_pages); // Update total pages

        // Map individual projects to each employee
        const updatedEmployees = response.data.employees.map(employee => {
          const employeeProjects = response.data.individual_projects.find(project => project.employee_id === employee.id);
          return {
            ...employee,
            individualProjects: employeeProjects ? employeeProjects.projects : [] // Assign individual projects array to employee
          };
        });

        setEmployees(updatedEmployees);
        // Update employeeProjects state
        setEmployeeProjects(response.data.individual_projects.reduce((acc, project) => {
          acc[project.employee_id] = project.projects;
          return acc;
        }, {}));

        // Log the entire response data for debugging
        console.log('Response data:', response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployeesAndProjects();
  }, [currentPage, managers.manager.id]);



  return (
    <div className="py-5">
      <div className="row">
        <div className="col-md-1">
          {showSearchBar && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '7rem', marginTop: '10px' }}
            />
          )}
        </div>
        <div className="col-md-10">
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {employees.map(employee => (
              <div className="col" key={employee.id}>
                <div className="card gradient-custom2">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 gradient-custom text-center text-white" style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="Avatar" className="img-fluid my-5" style={{ width: '80px' }} />
                        <div className='text-dark fw-bold'>
                          <p>{employee.name}</p>
                          <p>{employee.position}</p>
                        </div>
                        <i className="far fa-edit mb-5"></i>
                      </div>
                      <div className="col-md-8 ">
                        <div className='card-body p-4'>
                          <h6>Information</h6>
                          <table className="table">
                            <thead>
                              <tr>
                                <th className='bg-danger'>Email</th>
                                <th className='bg-success'>Payment</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className='bg-danger'>
                                <td className='bg-warning'>{employee.email}</td>
                                <td className='bg-dark text-white'>{employee.payment}</td>
                              </tr>
                            </tbody>
                          </table>
                          <h6>Projects</h6>
                          <Carousel className='gradient-custom5' style={{ borderRadius: '20px' }} controls={false} indicators={false} fade>
                            {employeeProjects[employee.id]?.map(project => (
                              <Carousel.Item key={project.id} interval={3000}>
                                <div className='p-2'>
                                  <h5>Project: {project.title}</h5>
                                  <p>Description: {project.description}</p>
                                </div>
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <input  className='filterbar' type="text" value={filter} onChange={handleSearch} placeholder="Search by employee name" />
          <div className="d-flex justify-content-center mt-3">
            {[...Array(totalPages).keys()].map(pageNumber => (
              <Button key={pageNumber + 1} onClick={() => handlePageChange(pageNumber + 1)} variant={currentPage === pageNumber + 1 ? 'primary' : 'secondary'}>{pageNumber + 1}</Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
