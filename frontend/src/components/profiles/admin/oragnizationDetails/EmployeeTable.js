import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';
import EditEmployeeModal from './EditEmployeeModal';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/emp/');
        setEmployees(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewMore = (employee) => {
    // Implement view more functionality
    console.log('View more employee:', employee);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleUpdateEmployee = async (updatedEmployeeData) => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/employee/${selectedEmployee.id}/`, updatedEmployeeData);
      console.log('Employee updated:', response.data);

      // Update the state with the updated employee data
      setEmployees(prevEmployees => prevEmployees.map(employee => {
        if (employee.id === selectedEmployee.id) {
          return { ...employee, ...updatedEmployeeData };
        }
        return employee;
      }));

      // Optionally, you can update the selectedEmployee state variable as well if needed
      setSelectedEmployee(null);

    } catch (error) {
      console.error('Error updating employee:', error);
    }
    handleCloseModal();
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '10px' , position:'absolute' , top:'15%' , right:'3%' , padding:'10px' , borderRadius:'10px' , outline:'none' }}
      />

      <Table striped bordered hover style={{ maxWidth: '600px', border: '1px solid #dee2e6', borderRadius: '5px', marginLeft: '30%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Update</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.position}</td>
              <td>
                <Button variant="primary" onClick={() => handleEdit(employee)}>
                  Edit
                </Button></td>
              <td>
                <Button variant="secondary" onClick={() => handleViewMore(employee)} style={{ marginLeft: '8px' }}>
                  View More
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <EditEmployeeModal
        show={showModal}
        handleClose={handleCloseModal}
        employee={selectedEmployee}
        handleUpdateEmployee={handleUpdateEmployee}
      />
    </>
  );
};

export default EmployeeTable;
