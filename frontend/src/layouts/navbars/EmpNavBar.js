import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.6)' }}>
      <Navbar.Brand href="https://www.beehyv.com/">
        <img src="https://www.beehyv.com/wp-content/uploads/2020/10/logo.svg" alt="Logo" className="img-fluid ms-1" style={{ height: '50px' }} />
      </Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link href="/detail">Home</Nav.Link>
      </Nav>
      <Navbar.Brand style={{ marginLeft: '280px' }}>
        <h1>Employee Details</h1>
      </Navbar.Brand>
      <Navbar.Brand className='button' style={{ marginLeft: '25rem' }}>
        <button className='logout btn  btn-lg btn-floating' onClick={handleLogout}><span>Log out</span></button>
      </Navbar.Brand>
    </Navbar>
  );
};

export default CustomNavbar;
