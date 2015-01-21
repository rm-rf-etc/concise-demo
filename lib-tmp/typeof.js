
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.

*/

/*
 * This is where these helper functions will live for now. Development of ConciseJS will continue
 * to drive development of ConnectedJS, and these helpers.
 */

module.exports = {

  familyOf: function familyOf(thing){
    var type = this.typeOf(thing)
    if (type) {
      return ({
        Date: 'simple'
      , String: 'simple'
      , Number: 'simple'
      , Boolean: 'simple'
      , Function: 'simple'
      , RegExp: 'simple'
      , Array: 'complex'
      , Object: 'complex'
      , HTMLElement: 'complex'
      , 'undefined': 'falsey'
      , 'null': 'falsey'
      , 'NaN': 'falsey'
      })[type] || 'complex'
    } else {
      return false
    }
  },

  typeOf: function typeOf(thing){
    if (typeof thing === 'number') return isNaN(thing) ? 'NaN' : 'Number'
    else if (thing instanceof HTMLElement) return 'HTMLElement'
    else return (thing !== null && thing !== undefined && thing.constructor) ? this.getObjectClass(thing) : '' + thing
  },

  getObjectClass: function getObjectClass(obj) {
    var string
    if (obj.constructor && obj.constructor.toString) string = obj.constructor.toString()
    else throw new Error('Object constructor does not have toString method.')

    return (/function\s+(\w+)/.test(string)) ? string.match(/function\s+(\w+)/)[1] : 'Anonymous Class'
  }

}
