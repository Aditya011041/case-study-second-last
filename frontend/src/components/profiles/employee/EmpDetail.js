import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/sidebar.css';
import '../../../styles/manager.css';
import backImg from '../../../assets/pictures/pic3.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomNavbar from '../../../layouts/navbars/EmpNavBar';
import Sidebar from './Sidebar';
import LeaveApplications from './LeaveApplications';
import Dashboard from './Dashboard';
import ProjectDetails from './ProjectDetails';
import ManagerDetails from './ManagerDetails';

function EmpDetail() {
  const location = useLocation();
  const emp_id = location.state?.emp_id;
  const [emp, setEmp] = useState(null);
  const [empApplication, setEmpApplication] = useState([]);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();
  const [leaveCounts, setLeaveCounts] = useState([]);

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate('/');
    }
  })

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/emp/${emp_id}`);
        setEmp(response.data);
        console.log(response.data);

      } catch (error) {
        console.error('Error fetching employee:', error);
      }

    };
    const fetchEmployeesApplications = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/emp-leave-details/${emp_id}`);
        
        setEmpApplication(response.data);
        console.log('setEmpApplication:' , response.data)
      } catch (error) {
        console.error('Error fetching employee leave applications:', error);
      }
    };

    fetchEmp();
    fetchEmployeesApplications();
  }, [emp_id]);

  useEffect(() => {
    const fetchLeaveCounts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/leave-counts/${emp_id}/`);
        setLeaveCounts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching leave counts:', error);
      }
    };
    fetchLeaveCounts();
  }, [emp_id])

 
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (emp && !toastShown && isLoggedIn) {
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
  }, [emp, toastShown]);
  if (toastShown) {
    sessionStorage.removeItem('isLoggedIn');
  }

  const leaveApply = () => {
    navigate('/leave', { state: { employeeEmail: emp.employee.email } });
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const handleAction = async (appId) => {
    try {
      const res = await axios.patch(`http://127.0.0.1:8000/cancel-leave-application/employee/${emp_id}/${appId}/`);
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      console.error('Error updating leave application:');
    }
  };

 
  console.log('logged');
  return (

    <div className='page' style={{ backgroundImage: `url(${backImg})`, backgroundPosition: 'center', backgroundSize: 'cover' }} >
      <div className='container-fluid'>
        <CustomNavbar />
        <div className="container-fluid" style={{ display: 'flex' , gap:'1%'}}>

          {/* sidebar */}

          <Sidebar onMenuItemClick={handleMenuClick} selectedMenuItem={selectedMenuItem} />

          <main className="main-content" style={{ flex: '1'  }}>
            {emp && (
              <>
                {selectedMenuItem === 'dashboard' && <Dashboard emp={emp} />}
                {selectedMenuItem === 'project' && <ProjectDetails emp={emp} />}
                {selectedMenuItem === 'leaves' && (
                  <LeaveApplications
                    emp={emp}
                    id = {emp_id}
                    empApplication={empApplication}
                    leaveCounts={leaveCounts}
                    leaveApply={leaveApply}
                    handleAction={handleAction}
                  />
                )}
              </>
            )}
          </main>

        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default EmpDetail;


