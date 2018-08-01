import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';
const { Panel, PanelGroup } = require('react-bootstrap/lib');


const ProjectList = ({ projects }) => {
    return (
        projects.length > 0 ?
        <PanelGroup accordion id = "projectList" > 
            {
                projects.map((project, i) => {
                    return (< ProjectListRow key = { i } index = {i} project = { project }/>)
                })
            }
        </PanelGroup> : <div></div>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

export default ProjectList;