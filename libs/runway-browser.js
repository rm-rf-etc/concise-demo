
var router = require('./runway.js')

window.onpopstate = function(event){
  window.alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
}


function processLink(){
  if (/^\//.test(this.href) || this.href.indexOf(location.host) > -1) {
    router.listener({ url:/http[s]?:\/\/[^\/]+\/(.*)$/.exec(this.href)[1] }, null)
    return false
  }
  return true
}
function init(){
  for (var i = 0, length = document.links.length; i < length; document.links[i++].onclick = processLink);
}
window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
