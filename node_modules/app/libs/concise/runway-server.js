
var router = {}

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
router.listener = function(url){

  var $, ops, route, args = [], n = 0

  // ops = {
  //   i_redirect: function(fn){ // replace the controller with a different one.
  //     $[$.length-1] = fn
  //   },
  //   error: function(code){
  //     sendError(code,req)
  //   }
  // }

  // Convert route into array of URL segments, ending with "$", the leaf node.
  route = url.slice(1).replace(/\/$/g,'').split('?')[0].split('/')
  route[route.length] = '$'

  // Climb the routes map, always check first for a matching static route segment before trying regex.
  $ = route.reduce(treeClimber, routes_tree)

  return $
  // i = -1
  // if ($) {
  //   // Execute in order, each function stored in the leaf node. (note: $[i++] != $[++i])
  //   (function next(){
  //     i++
  //     if ($[i])
  //       return $[i](req, res, args, ops, next)
  //     else
  //       return sendError('404', req, res, args, ops)
  //   })()
  // }
  // else sendError('404', req, res, args, ops)
}



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
