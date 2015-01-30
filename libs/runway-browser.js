
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
  var title = Math.random().toString().split('.')[1]
  if (history.pushState) history.pushState({url:url, title:title}, null, url)
  else location.assign(url)
}

window.addEventListener('popstate',function(event){
  doRoute(event.state.url)
})

window.onpopstate = function(event){
  // doRoute(event.state.url)
  // console.log( event )
  // window.alert('location: ' + document.location + ', state: ' + JSON.stringify(event.state))
}

function init(){
  history.replaceState( {url:location.pathname}, null, location.pathname )
  var ctrl = runway.finder(location.pathname)
  if (ctrl) ctrl()
}
// setTimeout(init,100)
window.addEventListener ? addEventListener('load', init, false) : window.attachEvent ? attachEvent('onload', init) : (onload = init)
