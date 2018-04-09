const React = require('react')
const ReactDOM = require('react-dom')

class ChapterList extends React.Component {
	render() {
	    return (
	      <li><a href="#">{this.props.result}</a></li>
	    );
	}	
}


module.exports = ChapterList

