
/*
The MIT License (MIT)

Copyright (c) 2014 Rob Christian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.

*/



;(function(){

  var connected = require('./connected.js')
  var Bindable = connected.Bindable
  var familyOf = require('./typeof.js').familyOf
  var typeOf = require('./typeof.js').typeOf


  var concise = new Concise()
  var DEFINE = Object.defineProperty
  var _current_modifiers_
  var MicroEvent = require('microevent')
  var _controller_events = new MicroEvent()

  concise.routes = require('./runway-browser.js').routes


  /*

  Concise Classes

  */

  function Concise(){
    this.current_view = null
    var view = document.createElement('view')
    var body = document.querySelector('body')
    body.insertBefore(view, body.firstChild)

    this.view_body = view
  }

  Concise.prototype.setView = function(view){
    if (this.current_view) this.view_body.removeChild(this.current_view)
    this.current_view = view
    this.view_body.appendChild(view)
  }

  Concise.prototype.helpers = Helpers()

  Concise.prototype.Controller = function(name, constructor){

    this._id = name || Math.random().toString().split('.')[1]

    var view = document.createElement('container')
    view.id = name || this._id

    var builder = new DomBuilder(null, view)
    builder.onActive = this.onActive

    constructor.call(this, builder)

    return function(){
      _controller_events.trigger(this._id)
      concise.setView(view)
    }
  }

  Concise.prototype.Controller.prototype.onActive = function(fn){
    _controller_events.bind(this._id, fn)
  }



  function DomBuilder(parent, el){
    this.el = el
    this.parent = parent || {}
    this.validates = false
  }

  DEFINE(DomBuilder.prototype, 'dom', {enumerable:false, configurable:false
  , set:domBuilderMethod
  })
  function domBuilderMethod(structure){
    //console.log(typeOf(structure), structure)
    if (! familyOf(this.el)) throw new Error('Missing valid view element. Cannot build a DOM before doing `o.view = document.querySelector(<your_selector>)`.')
    if (typeOf(structure) !== 'Object') throw new Error('Invalid dom structure object.')

    var helper_fn, helper_str, builder, value, data, parsed, el


    Object.keys(structure).map(function(key){
      value = structure[key]


      if (elDefinitionValidate(key)) {
        parsed = parseElementString(key)
        if (parsed.validate) this.validates = true
        el = parsed.el
        // console.log( 'USES VALIDATION', parsed.validate )
      }
      else return

      if (! value) {
        this.el.appendChild(el)
        return
      }

      builder = new DomBuilder(this, el)

      if (parsed.helpers && parsed.helpers.length) {
        parsed.helpers.map(function(helper_str){
          //
          if (typeOf(value) !== 'Function') throw new Error('DOM object "'+key+'" defined with helper method but has no function upon which to apply it.')

          helper_fn = concise.helpers[ helper_str.split('(')[0] ]

          data = /\((.+)\)/g.exec(helper_str)[1]
          data = data.split('.').reduce(function(object, prop){
            return object[prop]
          }, connected.models)
          helper_fn(builder,data,value)
          this.el.appendChild(el)
          // this.maintainer.include(key, el)
        }.bind(this))
      }
      else if (typeOf(value) === 'Object') {
        builder.dom = value
        this.el.appendChild(el)
        // this.maintainer.include(key, el)
      }
      else if (typeOf(value) === 'Function') {
        value.call(el,builder)
        this.el.appendChild(el)
        // this.maintainer.include(key, el)
      }

    }.bind(this))

    if (this.parent.validates && this.el.tagName === 'FORM') this.formValidate()
  }

  DEFINE(DomBuilder.prototype, 'model', {enumerable:false, configurable:false, set:function(){},
    get:function(){ return this._model || this.parent.model }
  })

  DomBuilder.prototype.onSubmit = function(cb){
    this.el.addEventListener('submit',cb)
  }

  DomBuilder.prototype.onClick = function(cb){
    this.el.addEventListener('click',cb)
  }

  DomBuilder.prototype.onInput = function(cb){
    this.el.addEventListener('input',cb)
  }

  DomBuilder.prototype.setValid = function(bool, string){
    this.el.setCustomValidity( bool ? '' : string )
  }

  DomBuilder.prototype.formValidate = function(){
    console.log( 'FORM VALIDATE', this )

    this._model = new Bindable({})
    var model = this._model
    var done_for = ['input','textarea']
    model._new_property_ = ['_valid_', false]


    var child = this.el.firstChild
    while (child) {
      if (done_for.indexOf(child.tagName.toLowerCase()) != -1 && child.name) {
        model._new_property_ = [child.name, '']
        // child.addEventListener('input',listener.bind(child))
        Bindable.bindField(child, model)
      }
      child = child.nextSibling
    }

    function listener(){ model[this.name] = this.value }
  }



  /* Takes a CSS selector-style string and generates corresponding real DOM element. */

  function parseElementString(desc){
    var el=null, tag='', id='', classes=[], regex=null, matches=true, properties=[], tokens, validate=false, helpers
    var keywords = ['validate']

    if (/#/g.test(desc) && /#/g.test(desc).length > 1)
      throw new Error("HTML descriptor cannot contain multiple id's: "+desc)

    if (! /^\w/g.test(desc))
      throw new Error("Descriptor doesn't begin with a tag name: "+desc)

    tokens = desc.match(/(?:[^\s"']+|['"][^"']*['"])+/g).slice(1)

    validate = tokens.indexOf('validate') !== -1


    if (/^[\w-]+(#[\w-]+)?(\.[\w-]+)*/.test(desc)) {

      tag = /^[\w-]+/.exec(desc)[0]

      id = /#[^.]+/g.test(desc) ? (/#([^.]+)/g).exec(desc)[1] : null

      classes = desc.split(' ')[0].split('.').slice(1)
    }
    else throw new Error('No tagName found in HTML descriptor: '+desc)


    tokens.map(function(string, id){ //console.log(id, string)
      // console.log( 'TOKEN', string )
      switch (true) {

        case (/^\d+$/.test(string)): //console.log('case',1)
          break;

        case (/^(\w[\w.]*)=["']([^'"]*)["']$/.test(string)): //console.log('case',2)
          var property_path
          matches = /^([\w.]+)=["']([^'"]*)["']$/.exec(string)
          property_path = matches[1].split('.')
          property_path.push( matches[2] )
          properties.push( property_path )
          break;

        case (/^[\w-]+$/.test(string)): //console.log('case',3)
          matches = /^[\w-]+$/.exec(string)
          if (keywords.indexOf(matches[0]) === -1) properties.push( [matches[0], true] )
          break;

        case (/^\w+\([^)]+\)$/.test(string)): //console.log('case',4)
          if (! helpers) helpers = []
          helpers.push(string)
          break;

        default: throw new Error('Invalid token in HTML descriptor: '+string)
      }
    })


    el = document.createElement(tag)
    if (classes.length)
      el.className = classes.join(' ')
    if (id)
      el.id = id

    // A property path is an array where each subsequent item is the value of the previous property on the parent.
    // This allows us to set nested properties defined as a string, like "style.display='block'".
    properties.forEach(function(prop_path){

      prop_path.reduce(function(parent, child){ //if (logit) console.log(parent, child)
        if (prop_path.indexOf(child) === prop_path.length-2) {
          parent[child] = prop_path.pop()
        } else {
          return parent[child]
        }
      }, el)

    })

    return { el:el, validate:validate, helpers:helpers }
  }


  function elDefinitionValidate(el_str){ return true
    if (/\s/g.test(el_str) && el_str.match(/\s/g).length > 1) {
      throw new Error('Invalid DOM object definition. Cannot have more than one space character.')
      return false
    }
    else return true
  }


  function Helpers(){
    return {
      each: function(o,data,constructor){ //console.log( constructor )

        if (! data) throw new Error('Helper received invalid data object with constructor: '+constructor.toString())
        connected.bind(data, function(keyval, type){
          // Further optimizations are likely to come.
          // if (type === 'push') {
          //   constructor.call(o.el, o, keyval[0], keyval[1])
          // }
          // else if (type === 'pop') {
          //   o.el.lastChild.outerHTML = ''
          // }
          o.el.innerHTML = ''
          buildDom()
        })


        function buildDom(){
          Object.keys(data).map(function(key){

            if (typeOf(constructor) === 'Function')
              constructor.call(o.el, o, key, data[key])

            else if (typeOf(constructor) === 'Object')
              o.dom = constructor

          })
        }
        buildDom()
      }
    }
  }

  if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
    module.exports = concise
  } else {
    window.concise = concise
  }

})()
