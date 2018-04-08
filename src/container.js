(function() {
  require("babel-register")({
    "presets": ["es2015", "react"],
     plugins: ['transform-decorators-legacy', 'transform-class-properties'],
    extensions: [".js", ".jsx"],
  });

  const  ReactDOM  = require('react-dom');
  var App = {
    init: function() {
     
      require("./require");
      //ReactDOM.render(Application, document.getElementById('content'));
      // const Page = require('./pages/page.js');

      // ReactDOM.render(<Page /> , document.getElementById('container'))

    }
  };
  window.App = App;
})();

document.addEventListener('DOMContentLoaded', App.init);
