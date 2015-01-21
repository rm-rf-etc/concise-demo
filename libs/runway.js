
/*!
 * Runway Router
 * Copyright(c) 2014 Rob Christian
 * MIT Licensed
 */

var _ = require('lodash')

// var typeOf = require('./typeof.js').typeOf

var routes_tree = Object.create(null)
var logger
var wildcards = [
  { card: '{int}', pattern: '([1-9][0-9]*)'     },
  { card: '{any}', pattern: '([0-9a-zA-Z-_.]+)' },
  { card: '{a-z}', pattern: '([a-zA-Z]+)'       },
  { card: '{num}', pattern: '([0-9]+)'          }
]



/**
 * The router API.
 */
function router(){

  add.config = config

  // c is for controller, f is for filters.
  function add(url, f, c){
    var $, nested

    if (typeof url !== 'string')
      throw new Error('Router accepts only a string as the first argument.')

    c = arguments[arguments.length-1]
    f = (Array.isArray(f)) ? f : []

    if (typeOf(c) !== 'Function') throw new Error('Controller either not specified or invalid.')
    f.forEach(f,function(e){
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
    _.merge(routes_tree, nested, function(a,b){
      var arr = a || b
      if (Array.isArray(a))
        return _.uniq(a.concat(b), function(x){if (x) return x.toString()})
      else if (Array.isArray(b))
        return b
    }) // Arrays are used for storing any segments which contain regex.

    return add
  }

  return add.apply(null, arguments)
}
router.config = config



/**
 * Configuration API.
 */
function config(name, obj){

  if (typeOf(name) === 'String') {

    switch (name) {

    case 'error':
      // Override default 404 response function.
      if (typeOf(obj) === 'Function') sendError = obj
      break

    case 'logger':
    case 'logging':
      // Provide a callback to use for logging. Change to null/false/undefined to disable.
      if (typeOf(obj) === 'Function') logger = obj
      break

    case 'wildcard':
    case 'wildcards':
      // Add new wild card expressions.
      if (Array.isArray(obj)) {
        wildcards = _(wildcards).concat(obj).where(function(obj){
          return obj.card && obj.pattern && typeOf(obj.card) === 'String' && typeOf(obj.pattern) === 'String'
        }).value()
      }
      break
    }
  }

  return router
}



// Default failure handler (when no matching route is found). Use config() to override.
function sendError(code, req, res, args, ops){
  res.end(code)
}

/**
 * This is the node HTTP request listener. It will try to match the requested URL
 * and invoke the associated controller, or otherwise invoke error(), which calls
 * req.end('404') as the default. But you can override the error handler using
 * config().
 */
router.listener = function(req, res){

  var $, ops, route, args, norm, regs, redirect, i, n
  args = []
  n = 0

  ops = {
    i_redirect: function(fn){ // replace the controller with a different one.
      $[$.length-1] = fn
    },
    error: function(code){
      sendError(code,req,res)
    }
  }

  // Convert route into array of URL segments, ending with "$", the leaf node.
  route = req.url.slice(1).replace(/\/$/g,'').split('?')[0].split('/')
  route[route.length] = '$'

  // Climb the routes map, always check first for a matching static route segment before trying regex.
  $ =  route.reduce(function(obj, seg){
    if (!obj)
      return

    norm = obj[seg] || undefined
    if (norm)
      return norm

    regs = obj['{regex}'] || undefined
    if (regs) {
      for (i=0; i < regs.length; i++) {
        if (regs[i].test(seg)) {
          args[n++] = regs[i].exec(seg)[1] // Increments n after the value is used for the assignment. More performant than .push().
          return obj[regs[i].toString()]
        }
      }
    }
  }, routes_tree) // <-- This is the object to climb.

  i = -1
  if ($) {
    // Execute in order, each function stored in the leaf node. (note: $[i++] != $[++i])
    (function next(){
      i++
      if ($[i])
        return $[i](req, res, args, ops, next)
      else
        return sendError('404', req, res, args, ops)
    })()
  }
  else sendError('404', req, res, args, ops)
}



/**
 * Helpers
 */
// Swap keys for values in a given string and return it as a regular expression.
function toRegExp(string){
  Object.keys(wildcards).forEach(function(e){
    e = wildcards[e]
    string = string.replace(e.card, e.pattern)
  })

  return new RegExp(string)
}
// A branch is a series of nested objects.
function newBranch(array, fn){
  return array.reverse().reduce(function(cumulate, segment){
    var x = Object.create(null)
    if (/\{...\}/g.test(segment)) {
      var re = toRegExp(segment)
      x['{regex}'] = [re]
      x[re.toString()] = cumulate
      return x
    } else {
      x[segment] = cumulate
      return x
    }
  }, fn)
}



/**
 */
module.exports = router
