
var router = require('./runway.js')

window.onpopstate = function(event){
  window.alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
}


function processLink(){
  var url = this.href
  url = (this.href[0] === '/') ? this.href.slice(1) : /(http:|https:)?\/\/[^\/]+\/(.*)$/.exec(this.href)[2]
  router.listener({ url:url }, null)
  return false
}
function init(){
  for (var i = 0, length = document.links.length; i < length; document.links[i++].onclick = processLink);
}
window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
