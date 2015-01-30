
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
    goForward(href)
    doRoute(href)
    return false
  }
  return true
}

function doRoute(href){
  var ctrl = runway.finder(href)
  if (ctrl) ctrl()
}

function goForward(url){
  if (history.pushState) history.pushState({url:url}, null, url)
  else location.assign(url)
}

window.onpopstate = function(event){ doRoute(event.state.url) }

function init(){
  // history.replaceState( {url:location.pathname}, null, location.pathname )
  doRoute(location.pathname)
}

window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
