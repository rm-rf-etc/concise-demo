
var runway = require('./runway.js')
module.exports = runway



var onclick_els = ['A','BUTTON']

document.onclick = function(event) {
  event = event || window.event // IE specials
  var target = event.target || event.srcElement // IE specials

  console.log('click happened:', target.dataset.href)

  if (onclick_els.indexOf(target.tagName) !== -1) {
    event.preventDefault()
    processLink(target.href, target.dataset.ajax)
  }
}

function processLink(href, ajax){
  console.log('processLink', href)
  href = href.replace(location.origin,'')
  if (ajax !== 'none') {
    goForward(href)
    doRoute(href)
    return false
  }
  return true
}

function doRoute(href){
  var ctrl = runway.goto(href)
  if (ctrl) ctrl()
}

function goForward(url){
  if (history.pushState) history.pushState({url:url}, null, url)
  else location.assign(url)
}

window.onpopstate = function(event){ doRoute(event.state.url) }

function init(){
  history.replaceState( {url:location.pathname}, null, location.pathname )
  doRoute(location.pathname)
}

window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
