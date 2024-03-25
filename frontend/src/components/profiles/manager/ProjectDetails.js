import React, { useState } from 'react';
import { ListGroup, Pagination, Row, Col } from 'react-bootstrap';

const ProjectDetails = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  // Calculate the index range for the current page
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;

  // Slice the projects array to display only the projects for the current page
  const paginatedProjects = projects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Row xs={1} md={2} className="g-4">
        {paginatedProjects.map((project) => (
          <Col key={project.id}>
            <div className="card mb-4">
              <div className="card-body">
                <ListGroup className="list-group list-group-flush">
                  <ListGroup.Item className="fs-5 fw-bold text-primary">
                    Title: {project.title}
                  </ListGroup.Item>
                  <ListGroup.Item className="fs-6 fw-bold text-secondary">
                    Description: {project.description}
                  </ListGroup.Item>
                  <ListGroup.Item className="fs-6 fw-bold text-muted">
                    Assigned to: {project.assigned_to.map((employee, index) => (
                      <span key={employee.id}>
                        {index > 0 && ', '}
                        {employee.name}
                      </span>
                    ))}
                  </ListGroup.Item>
                  <ListGroup.Item className="fs-6 fw-bold text-muted">
                    Managers: {project.managers.map((manager, index) => (
                      <span key={manager.id}>
                        {index > 0 && ', '}
                        {manager.name}
                      </span>
                    ))}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default ProjectDetails;
