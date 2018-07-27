import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';

const ProjectList = ({projects}) => {
  return (
    projects.length > 0 ?
    <table className="table">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, i) =>{
          return(<ProjectListRow key={i} project={project} />)
          })
        }
      </tbody>
    </table> : <div></div>
  );
};

ProjectList.propTypes = {
  projects: PropTypes.array.isRequired
};

export default ProjectList;
