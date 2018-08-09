import React, { PropTypes } from 'react';
import ProjectListRow from './ProjectListRow';
const { Panel, PanelGroup, Tabs, Tab } = require('react-bootstrap/lib');


const ProjectList = ({ projects, showLoader, loadingMsg, setToken }) => {
    return (
        <Tabs id="projectList">
            <Tab eventKey={1} title="Paratext">
                { projects.length > 0 ?
                    <div>
                        <PanelGroup accordion id = "projectList" > 
                            {
                                projects.map((project, i) => {
                                    return (< ProjectListRow key = { i } index = {i} project = { project } showLoader = { showLoader} setToken = {setToken}/>)
                                })
                            }
                        </PanelGroup> 
                    </div> : <div>{loadingMsg}</div>
                }
            </Tab>
            <Tab eventKey={2} title="Door 43">
                <div>Coming Soon...</div>
            </Tab>
        </Tabs>
    );
};

ProjectList.propTypes = {
    projects: PropTypes.array.isRequired
};

export default ProjectList;