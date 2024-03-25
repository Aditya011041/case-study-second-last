import React from 'react';

const Dashboard = ({ emp }) => {
  return (
    <section className="vh-100">
      <div className="container py-4 h-100">
        <div className="row d-flex justify-content-center  h-100">
          <div className="col-md-12 col-xl-4">
            <div className="card gradient-custom3" style={{ borderRadius: '15px', marginBottom: '60px', boxShadow: ' 0 5px 5px 0 rgba(0, 0, 0, 0.5), 0 2px 10px 0 rgba(0, 0, 0, 1.5)' }}>
              <div className="card-body  text-center p-2">
                <div className="mt-2 mb-5">
                  <img src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp' alt='Image' className="rounded-circle img-fluid" style={{ width: '100px' }} />
                </div>
                <h4 className="mb-2 gradient-custom4 fw-bold fs-3">{emp.employee.name}</h4>
                <p className="text-muted fw-bold mb-4">@{emp.employee.position} <span className="mx-2">|</span> <a className='text-primary' href="">{emp.employee.department}</a></p>

                <button type="button" className="btn btn-primary btn-rounded btn-lg">
                  Hey! - Its me
                </button>
                <div className="d-flex justify-content-between text-center mt-5 mb-2">
                  <div>
                    <p className="mb-2 h5 text-success">{emp.employee.payment}</p>
                    <p className="text-muted mb-0 fs-4 fw-bold">Salary</p>
                  </div>
                  <div className="px-4">
                    <p className="mb-2 text-success h5">02/Jan/2024</p>
                    <p className="text-muted mb-0 fs-4 fw-bold">Joined</p>
                  </div>
                  <div>
                    <p className="mb-2 text-success h5">Male</p>
                    <p className="text-muted mb-0 fs-4 fw-bold">Gender</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default Dashboard;
