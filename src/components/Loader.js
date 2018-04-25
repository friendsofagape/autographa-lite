import React from 'react';
class Loader extends React.Component {

	render() {
		return(
        	<div id="loading-img">
		        <div>
		            <p className="loading">This may take a few minutes. <br/>Please wait</p>
		        </div>
    		</div>
		)
	}

}
export default Loader;