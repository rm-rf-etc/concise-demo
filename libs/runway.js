
/*!
 * Runway Router
 * Copyright(c) 2015 Rob Christian
 * MIT Licensed
 */

var typeOf = require('./typeof.js').typeOf

var routes_tree = Object.create(null)
var logger
var wildcards = {
  '{int}': '([1-9][0-9]*)',
  '{any}': '(.*)',
  '{a-z}': '([a-zA-Z]+)',
  '{num}': '([0-9]+)'
}

module.exports = {
  routes: router
, finder: pathMatcher
}



/**
 * Calling this function adds a new route.
 */
function router(arg1, f, c){ // c is for controller, f is for filters.
  var $, url, nested

  if (typeOf(arg1) === 'Array' && arg1.length && !f) {

    arg1.map(function(r){ router.apply(null,r) })

    return
  }

  if (typeof arg1 !== 'string')
    throw new Error('Router accepts only a string as the first argument.')
  url = arg1

  c = arguments[arguments.length-1]
  f = (Array.isArray(f)) ? f : []

  if (typeOf(c) !== 'Function') throw new Error('Controller either not specified or invalid.')
  f.forEach(function(e){
    if (typeOf(e) !== 'Function') throw new Error('Filter is not a function: '+{}.toString.apply(e))
  })

  $ = [].concat(f).concat(c)

  if (logger && typeOf(logger) === 'Function')
    logger('add route:', url, 'filters and controller:', $)
  // Convert route string into array of path segments.
  url = url.replace(/(^\/|\/$)/g,'').split('/')
  url[url.length] = '$'
  nested = newBranch(url, $)

  // Now include the new route in our routes map object.
  treeMerge(routes_tree, nested)

  return router
}



/**
 * Test a given URL. If it matches, return the leaf node from the routes_tree.
 */
function pathMatcher(url){
  // console.log('pathMatcher', url, routes_tree)
  if (! routes_tree) throw new Error('No routes defined.')

  var args = [], n = 0

  // Convert route into array of URL segments, ending with "$", the leaf node.
  var route = url.slice(1).replace(/\/$/g,'').split('?')[0].split('/')
  route[route.length] = '$'

  var ctrl = route.reduce(treeClimber, routes_tree)[0] // <- leaf node from matching route, or undefined.
  return ctrl ? function(){ ctrl.apply(null, args) } : null


  // We define this internally so that args and n are within scope.
  // Climb the routes tree. Always check first for a matching static route segment before trying regex.
  function treeClimber(obj, seg){
    if (! obj) return null

    return obj[seg] || (function(){
      var regs = obj['<regex>'] || undefined
      if (regs) {
        for (var i=0; i < regs.patterns.length; i++) {
          if (regs.patterns[i].test(seg)) {
            args[n++] = seg // Increments n after the value is used for the assignment. More performant than .push().
            return regs[regs.patterns[i].toString()]
          }
        }
      }
    })()
  }

}




/**
 * Helpers
 */
// This converts an array representation of a complete route path, into a series of nested objects.
function newBranch(array, fn){
  return array.reverse().reduce(branchBuildingLogic, fn)
}

function branchBuildingLogic(cumulate, segment){
  var x = Object.create(null)

  if (! /^\{.+\}$/g.test(segment)) {
    x[segment] = cumulate
    return x
  }
  else {
    if (! wildcards(segment)) throw new Error('Unknown wildcard used in route: '+segment)

    var re = new RegExp(wildcards[segment])
    x['<regex>'] = { patterns: [re] }
    x['<regex>'][re.toString()] = cumulate
    return x
  }
}

// This merges a branch object (nested objects representing a route path) into our route tree object.
function treeMerge(to,from,fn){ //console.log(to,from,fn)
  Object.keys(from).map(function(prop){ //console.log('property:',prop)

    switch (true) {

      case prop === '<regex>':
        if (Object.hasOwnProperty.call(to,prop)) {
          from[prop].patterns.map(function(regex){
            if (hasMatchingRegex(to[prop].patterns, regex)) to[prop].patterns.push(regex)
          })
        }
        else to[prop] = from[prop]
        break

      case Object.hasOwnProperty.call(to,prop):
        treeMerge(to[prop],from[prop])
        break

      default:
        to[prop] = from[prop]

    }
    return
  })
}

function hasMatchingRegex(array,regex){
  return array.reduce(function(last,next){ return last || regexCompare(next,regex) }, false)
}

function regexCompare(a,b){
  return a.toString() === b.toString()
}