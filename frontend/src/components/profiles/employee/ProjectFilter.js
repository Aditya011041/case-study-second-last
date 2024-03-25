import React, { useState } from 'react';
import axios from 'axios';

const ProjectFilter = ({ onFilter }) => {
  const [projectName, setProjectName] = useState('');

  const handleFilterChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleFilterSubmit = () => {
    onFilter(projectName);
  };

  return (
    <div>
      <input type="text" value={projectName} onChange={handleFilterChange} />
      <button onClick={handleFilterSubmit}>Filter</button>
    </div>
  );
};

export default ProjectFilter;
