import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import LeaveApplicationList from './LeaveApplicationList';
import { useNavigate } from 'react-router-dom';
import ManagerLeaveApplicationForm from '../../../layouts/forms/ManagerLeaveApplicationForm';
import axios from 'axios';
import ManagerLeaveTable from './ManagerLeaveTable';

const LeavesSection = ({ bellClicked, notifications, handleBellClick, handleCloseNotify, manager_Id}) => {
  
  const [showForm, setShowForm] = useState(false);
  const [showManagerTable, setShowManagerTable] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState([]);

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  const handleManagerTableToggle = () => {
    setShowManagerTable(!showManagerTable);
  };

  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/manager-leave-applications/${manager_Id}/`);
        setLeaveApplications(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching leave applications:', error);
      }
    };
    fetchLeaveApplications();
  }, [manager_Id]);

  return (
    <>
      <div className="dropdown" style={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <span className='text-primary fw-bold fs-2 p-2' style={{ marginLeft: '80%' }}>Notifications</span>
        <div
          className={`me-3 dropdown-toggle hidden-arrow ${bellClicked ? 'active' : ''}`}
          id="navbarDropdownMenuLink"
          role="button"
          data-mdb-toggle="dropdown"
          aria-expanded="false"
          onClick={handleBellClick}
        >

          <span className="badge rounded-pill badge-notification bg-danger fs-6">{notifications && notifications.length} </span>
          <i className="fas fa-chevron-down bg-primary "></i>
        </div>
        <ul className={`dropdown-menu ${bellClicked ? 'show' : ''} gradient-custom5 p-2`} aria-labelledby="navbarDropdownMenuLink" style={{ marginTop: '20rem', marginRight: '3rem' }}>
          {notifications && bellClicked && notifications.map((notification) => (
            <ListGroup className='p-2'>
              <ListGroup.Item key={notification.id} style={{ backgroundColor: '#adf9be' }}>
                <div className="dropdown-item text-muted fw-bold">{notification.message}</div>
              </ListGroup.Item>
            </ListGroup>
          ))}

          {notifications && bellClicked && (
            <li>
              <button className="dropdown-item " style={{ boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.5), 0 2px 10px 0 rgba(0, 0, 0, 0.5)', width: '6rem', borderRadius: '10px' }} onClick={() => handleCloseNotify(manager_Id)}><span className='fs-5 fw-bold text-center'>Clear </span> </button>
            </li>
          )}
        </ul>
      </div>
      <div className="leave-application-list ">
        <LeaveApplicationList managerId={manager_Id} />
      </div>
      <div className="manager-leave-application-form">
        <button onClick={handleFormToggle}>Toggle Leave Application Form</button>
        {showForm && <ManagerLeaveApplicationForm managerId={manager_Id} />}
      </div>
      <button onClick={handleManagerTableToggle}>{showManagerTable ? 'Close Manager Table' : 'Show Manager Table'}</button>
      {showManagerTable && <ManagerLeaveTable leaveApplications={leaveApplications} />}
    </>
  );
}

export default LeavesSection;
