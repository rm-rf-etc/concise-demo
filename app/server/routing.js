
var index = require('fs').readFileSync('./public/index.html')

module.exports = function(req, res, next){
  if (/^\/styles|^\/scripts|^\/data/g.test(req.url)) next()
  // else if (/^\/favicon\.ico/g.test(req.url))
  else {
    // console.log( 'index!', req.url )
    res.writeHeader(200, { "Content-Type":"text/html" })
    res.end( index )
  }
}
