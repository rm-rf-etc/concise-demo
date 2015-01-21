
// var router = require('./runway.js')

window.onpopstate = function(event){
  window.alert("location: " + document.location + ", state: " + JSON.stringify(event.state))
}
