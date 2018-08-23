import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';


const ProjectList = ({ projects, showLoader, loadingMsg, setToken }) => {
    return (
        projects.length > 0 ?
        
        <div style={{height: '400px', overflowY: 'auto', marginTop: '10px'}}><span style={{color: '#0b82ff',fontWeight: 'bold' }}>Available Projects</span>
            {
                projects.map((project, i) => {
                    return (<ProjectListRow key = { i } index = {i} project = { project } showLoader = { showLoader} setToken = {setToken}/>)
                })
            }
        </div>  : <div style={{color: '#0b82ff',fontWeight: 'bold', marginTop: '10px' }}>No projects to show.</div>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

export default ProjectList;