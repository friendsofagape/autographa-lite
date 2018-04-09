import React from 'react';
class Loader extends React.Component {

	render() {
		return(
        	<div id="loading-img">
		        <div>
		        	<img className="loader-css" src={"../assets/images/loader.gif"} />
		            <p className="loading">This may take a few minutes. Please wait</p>
		        </div>
    		</div>
		)
	}

}
export default Loader;