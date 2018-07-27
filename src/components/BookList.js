import React from 'react';
const { Modal } = require('react-bootstrap/lib');

class BookList extends React.Component {
	
	render() {

	      return(<Modal show={true}onHide={closeList} id="tab-search">
	        <Modal.Header closeButton>
	          <Modal.Title>Book List</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
	          
	         
	        </Modal.Body>
	        <Modal.Footer>
	       
	        </Modal.Footer>
      </Modal>)
	}	
}

export default BookList;