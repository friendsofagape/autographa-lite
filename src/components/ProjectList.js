import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';
const { Panel, PanelGroup, Tabs, Tab } = require('react-bootstrap/lib');


const ProjectList = ({ projects, showLoader, loadingMsg, setToken }) => {
    return (
                projects.length > 0 ?
                    <div><span style={{color: '#0b82ff',fontWeight: 'bold' }}>Available Projects</span>
                    <PanelGroup accordion id = "projectList" > 
                        {
                            projects.map((project, i) => {
                                return (< ProjectListRow key = { i } index = {i} project = { project } showLoader = { showLoader} setToken = {setToken}/>)
                            })
                        }
                    </PanelGroup></div> : <div>{loadingMsg}</div>
            
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

export default ProjectList;