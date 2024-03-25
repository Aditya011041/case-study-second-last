import React from 'react';

const Dashboard = ({ manager }) => {
  return (
    <section key={manager.id} className="vh-50">
    <div className="container py-4 h-100">
      <div className="row d-flex justify-content-center h-100">
        <div className="col-md-11 col-xl-5">
          <div className="card  gradient-custom3" style={{ borderRadius: '15px', boxShadow: ' 0 5px 5px 0 rgba(0, 0, 0, 0.5), 0 2px 10px 0 rgba(0, 0, 0, 1.5)' , position:'absolute' , top:'20%' , width:'30%'}}>
            <div className="card-body text-center">
              <div className="mt-3 mb-4 text-center">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" className="rounded-circle img-fluid" style={{ width: '100px' }} alt="Profile" />
              </div>
              <h4 className="mb-2 gradient-custom4 fw-bold fs-3">{manager.name}</h4>
              <p className="text-muted fw-bold mb-4">@Manager <span className="mx-2">|</span> <a href="">Project Lead</a></p>
              <button type="button" className="btn btn-primary btn-rounded btn-lg">
                Welcome ! --- {manager.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Dashboard;
