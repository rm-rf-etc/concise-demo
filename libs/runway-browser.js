
var runway = require('./runway.js')
module.exports = runway



document.onclick = function(event) {
  event = event || window.event // IE specials
  var target = event.target || event.srcElement // IE specials

  if (target.tagName === 'A') {
    event.preventDefault()
    processLink.call(target)
  }
}

function processLink(){
  var href = this.href.replace(location.origin,'')
  // console.log('processLink', this.href, href)
  if (this.dataset.ajax !== 'none') {
    var ctrl = runway.finder(href)
    if (ctrl) {
      ctrl()
      updateUrl(href)
    }
    return false
  }
  return true
}

function updateUrl(url){
  if (history.pushState) history.pushState(null, '', url)
  else location.assign(url)
}

window.onpopstate = function(event){
  window.alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
}

// function init(){
//   for (var i = 0, length = document.links.length; i < length; document.links[i++].onclick = processLink);
// }
// window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
