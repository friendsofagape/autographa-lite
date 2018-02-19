(function() {
  require("babel-register")({
    extensions: [".js", ".jsx"],
    presets: ['es2015', 'react'],
    plugins: ['transform-decorators-legacy', 'transform-class-properties', [
      "react-intl", {
        "messagesDir": "./build/messages",
        "enforceDescriptions": false
      }
    ]]

  });

  
  var App = {
    init: function() {
     
      var Application = require("./require");
      //ReactDOM.render(Application, document.getElementById('content'));
    }
  };
  window.App = App;
})();

document.addEventListener('DOMContentLoaded', App.init);
