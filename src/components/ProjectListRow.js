import React, { PropTypes } from 'react';
import swal from 'sweetalert';
import AutographaStore from "./AutographaStore";
import BookList from './BookList';

class ProjectListRow extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			bookList: []
		}
	}

  	importParatextSrc = (projectId) => {
	    const currentTrans = AutographaStore.currentTrans;
	    swal({
	        title: "Warning",
	        text: "This will overwrite any existing text in the selected books",
	        icon: "warning",
	        buttons: [currentTrans["btn-ok"], currentTrans["btn-cancel"]],
	        dangerMode: false,
	        closeOnClickOutside: false,
	        closeOnEsc: false
	      })
	      .then((action) => {
	        if (action) {
	        } else {
	        	this.setState({bookList: ["test"]})
	        }
	    });
  	}
  render (){
  	const project = this.props.project;
  	return (
	    	<tr>
	      		<td>{project.proj[0]}</td>
	      		<td><a href="javascript:;" onClick={() => {this.importParatextSrc(project.projid[0])}}>Get Books</a></td>
	    	</tr>
	    );
	};
}
ProjectListRow.propTypes = {
  project: PropTypes.object.isRequired
};
export default ProjectListRow;