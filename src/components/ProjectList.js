import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';
const { Panel, PanelGroup } = require('react-bootstrap/lib');


const ProjectList = ({ projects, showLoader, loadingMsg }) => {
    return (
        projects.length > 0 ?
        <div>ParaText Projects
        <PanelGroup accordion id = "projectList" > 
            {
                projects.map((project, i) => {
                    return (< ProjectListRow key = { i } index = {i} project = { project } showLoader = { showLoader}/>)
                })
            }
        </PanelGroup> </div> : <div>{loadingMsg}</div>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

export default ProjectList;