const React = require('react')
const ReactDOM = require('react-dom')

class BookBox extends React.Component {
	
	render() {

	    return (
	      <li>{this.props.result}</li>
	    );
	}	
}

module.exports = BookBox;