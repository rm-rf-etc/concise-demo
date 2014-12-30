
;(function(){

  window.annular = new Annular()


  /*

  Annular Class

  */

  function Annular(){
    this.modelHandler = new CrossTalk.Binding({})
    this.models = this.modelHandler.bindable
    this.helpers = {
      each: function(obj,fn){
        var keys = Object.keys(obj)
        for (var i in keys) {
          var key = keys[i]
          // console.log('EACH', this, key, obj[key])
          fn.call(this, key, obj[key])
        }
      }
    }
  }

  Annular.prototype.controllers = {}

  Annular.prototype.controller = function(name, constructor){
    annular.controllers[name] = constructor

    var body = document.querySelector('#body')
    var self = {
      models: annular.models,
      appendChild: function(el){ body.appendChild(el) }
    }
    attachDomMethod(self)

    constructor.apply(self)
  }


  function attachDomMethod(obj){
    Object.defineProperty(obj,'dom',{enumerable:false, configurable:false, set:domBuilder})
  }
  function domBuilder(obj){
    var helper, keys, key, val, dom_n_helper, name, args, el

    keys = Object.keys(obj)
    for (var i in keys) {
      key = keys[i]
      val = obj[key]

      helper = null
      if (/\s/g.test(key)) {
        dom_n_helper = key.split(' ')
        if (dom_n_helper.length > 2)
          throw new Error('Invalid DOM object definition. Cannot have more than one space character.')
        helper = dom_n_helper[1]
        key = dom_n_helper[0]
      }
      el = elFromString(key)

      if (! val) {
        this.appendChild(el)
      }
      else if (helper) {
        if (typeOf(val) !== 'Function')
          throw new Error('DOM object defined with helper method but has no function upon which to apply it.')
        attachDomMethod(el)

        name = /(\w+)/g.exec(helper)[1]
        args = /\((.+)\)/g.exec(helper)[1]

        args = args.split('.').reduce(function(data, prop, idx){
          return data[prop]
        },annular)

        helper = annular.helpers[name]
        helper.call(el,args,val)
        this.appendChild(el)
      }
      else if (typeOf(val) === 'Object') {
        domBuilder.call(el,val)
        this.appendChild(el)
      }
      else if (typeOf(val) === 'Function') {
        attachDomMethod(el)
        val.call(el)
        this.appendChild(el)
      }
    }
  }


  /* Takes a CSS selector-style string and generates corresponding real DOM element. */

  function elFromString(desc){
    var el=null, tag='', id='', classes=[], type='', regex=null, matches=true, properties={}, props=''

    if (/{[\w-]+}/g.test(desc))
      throw new Error("elFromString() received a widget identifier.")

    if (/#/g.test(desc) &&/#/g.test(desc).length > 1)
      throw new Error("HTML descriptor cannot contain multiple id's: "+desc)

    if (! /^\w/g.test(desc))
      throw new Error("Descriptor doesn't begin with a tag name: "+desc)

    regex = /\[(\w+)=["'](\w+)["']\]/g
    while (matches = regex.exec(desc))
      properties[matches[1]] = matches[2]

    tag = /^(\w+)/g.exec(desc)[1]

    id = /#[^.]+/g.test(desc) ? /#([^.]+)/g.exec(desc)[1] : null

    regex = /(\.[^#.]+)/g
    while (matches = regex.exec(desc))
      classes.push(matches[0].slice(1))

    el = document.createElement(tag)
    if (classes.length)
      el.className = classes.join(' ')
    if (id)
      el.id = id

    var props = Object.keys(properties)
    for (var i in props) {
      var prop = props[i]
      el[prop] = properties[prop]
    }

    return el
  }

})()
