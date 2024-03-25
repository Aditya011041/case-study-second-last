import React from 'react';

export default function Sidebar({ selectedMenuItem, handleMenuClick }) {
  return (
    <nav id="sidebarMenu" className="col-md-2 col-lg-2 ">
      <div className="position-sticky">
        <div className="list-group list-group-flush">
          <a className={`list-group-item list-group-item-action ripple ${selectedMenuItem === 'dashboard' ? 'active' : ''}`} onClick={() => handleMenuClick('dashboard')}>
            <i className="fas fa-tachometer-alt fa-fw "></i><span className='text'>Main dashboard</span>
          </a>
          <a className={`list-group-item list-group-item-action ripple ${selectedMenuItem === 'employee' ? 'active' : ''}`} onClick={() => handleMenuClick('employee')}>
            <i className="fas fa-chart-area fa-fw"></i><span className='text'>Employee Details</span>
          </a>
          <a className={`list-group-item list-group-item-action ripple ${selectedMenuItem === 'project' ? 'active' : ''}`} onClick={() => handleMenuClick('project')}>
            <i className="fas fa-lock fa-fw "></i><span className='text'>Project Details</span>
          </a>
          <a className={`list-group-item list-group-item-action ripple ${selectedMenuItem === 'leaves' ? 'active' : ''}`} onClick={() => handleMenuClick('leaves')}>
            <i className="fas fa-chart-line fa-fw "></i><span className='text'>Leaves Section</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
