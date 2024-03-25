import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import LeaveApplicationList from './LeaveApplicationList';
import { ListGroup } from 'react-bootstrap';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import Carousel from 'react-bootstrap/Carousel';
import sound from '../../../assets/sounds/message.mp3';
import CustomNavbar from '../../../layouts/navbars/ManagerNavBar';
import Dashboard from './Dashboard';
import EmployeeDetails from './EmployeeDetails';
import ProjectDetails from './ProjectDetails';
import LeavesSection from './LeavesSection';
import Sidebar from './ManagerSideBar';


export default function ManagerDetail() {
  const [managers, setManagers] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [bellClicked, setBellClicked] = useState(false);
  const [readStatus, setReadStatus] = useState(false);
  const [leaveApplication, setLeaveApplication] = useState(null);
  const location = useLocation();
  const manager_Id = location.state?.manager_Id;
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('token');
    if (!isLoggedIn) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {

    const fetchManager = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/manager/${manager_Id}`);
      setManagers(response.data);
      console.log(response.data);
      console.log(managers);
    };

    const getNotifications = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/manager-notifications/${manager_Id}`);
      setNotifications(response.data);
    };

    const getLeaveApplications = async () => {
      const response = await axios.get(`http://127.0.0.1:8000/leaveapplicationlist/manager/${manager_Id}`);
      setLeaveApplication(response.data);
    };

    getNotifications();
    fetchManager();
    getLeaveApplications();
  }, [manager_Id]);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (managers && !toastShown && isLoggedIn) {
      toast.success('Logged in successfully!', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setToastShown(true);
    }
  }, [managers, toastShown]);

  if (toastShown) {
    sessionStorage.removeItem('isLoggedIn');
  }

  const handleBellClick = async () => {
    const response = await axios.get(`http://127.0.0.1:8000/manager-read-all/${manager_Id}`);
    setReadStatus(response.data.notification_read_status);
    setBellClicked(!bellClicked);
    if (notifications && notifications.length > 0) {
      const audio = new Audio(sound);
      audio.play();
    }
  };

  const handleCloseNotify = async (managerId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/manager-read-all/${managerId}`);
    } catch (error) {
      console.error('Error deleting notifications:', error);
    }
    if (!readStatus) {
      setBellClicked(false);
    }
    if (notifications.length !== 0) {
      window.location.reload();
    }
  };

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    navigate('/')
  };
  //  const filteredEmployees = managers && managers.manager ? 
  //   [managers.manager].map(manager => ({
  //     ...manager,
  //     employees: searchTerm ? manager.employees.filter(employee =>
  //       employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     ) : manager.employees
  //   })) 
  //   : [];




  return (
    <>
      <div className='container-fluid'>
        <CustomNavbar />

        <div className='container-fluid' style={{ paddingTop: '20px' , display:'flex' }}>
          <Sidebar selectedMenuItem={selectedMenuItem} handleMenuClick={handleMenuClick} />

          <main className='col-md-9' style={{flexGrow:'1'}}>
            {selectedMenuItem === 'dashboard' && managers && <Dashboard manager={managers.manager} />}

            {selectedMenuItem === 'employee' && managers && (
              <EmployeeDetails managers={managers} count={managers.pagination.total_pages}/>
            )}
            {selectedMenuItem === 'project' && managers && (
              <ProjectDetails projects={managers.projects_under_manager} />
            )}

            {selectedMenuItem === 'leaves' && (
              <LeavesSection
                bellClicked={bellClicked}
                notifications={notifications}
                handleBellClick={handleBellClick}
                handleCloseNotify={handleCloseNotify}
                manager_Id={manager_Id}
              />
            )}
          </main>
        </div>
        <ToastContainer />
      </div>
    </>
  );

}




