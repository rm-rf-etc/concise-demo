
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

Semi-colons are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.

*/



;(function(){

  window.concise = new Concise()
  var DEFINE = Object.defineProperty
  var _current_modifiers_


  /*

  Concise Classes

  */

  function Concise(){}

  Concise.prototype.controllers = {}

  Concise.prototype.helpers = Helpers()

  Concise.prototype.controller = function(name, constructor){
    concise.controllers[name] = constructor

    var builder = new DomBuilder()

    constructor.call(this,builder)
  }

  function DomBuilder(el){
    this.el = el
    this.modifiers = []
  }
  DEFINE(DomBuilder.prototype, 'view', {enumerable:false, configurable:false,
    set:function(el){
      if (! familyOf(el))
        throw new Error('View object must be an HTML Element. Try using `o.view = document.querySelector(<your_selector>)`.')
      else
        this.el = el
    }
  })
  DEFINE(DomBuilder.prototype, 'dom', {enumerable:false, configurable:false,
    set:function(structure){
      if (! familyOf(this.el)) throw new Error('Missing valid view element. Cannot build a DOM before doing `o.view = document.querySelector(<your_selector>)`.')
      if (typeOf(structure) !== 'Object') throw new Error('Invalid dom structure object.')

      var helper_fn, helper_str, builder, value, data, el_str, parsed, el


      Object.keys(structure).map(function(key){
        value = structure[key]


        if (elDefinitionValidate(key)) {
          el_str = key.split('|')[0]
          parsed = parseElementString(el_str)
          el = parsed.el
        }
        else return

        if (! value) {
          this.el.appendChild(el)
          // this.maintainer.include(el_str, el)
          return
        }
        builder = new DomBuilder(el)
        if (this.model) builder.model = this.model

        if (parsed.helpers) {
          // if (typeOf(value) !== 'Function') throw new Error('DOM object "'+key+'" defined with helper method but has no function upon which to apply it.')

          // helper_fn = concise.helpers[ helper_str.split('(')[0] ]

          // data = /\((.+)\)/g.exec(helper_str)[1]
          // data = data.split('.').reduce(function(object, prop){
          //   return object[prop]
          // },concise)

          // helper_fn(builder,data,value)
          // this.el.appendChild(el)
          // // this.maintainer.include(el_str, el)
        }
        else if (typeOf(value) === 'Object') {
          builder.dom = value
          this.el.appendChild(el)
          // this.maintainer.include(el_str, el)
        }
        else if (typeOf(value) === 'Function') {
          value.call(el,builder)
          this.el.appendChild(el)
          // this.maintainer.include(el_str, el)
        }

      }.bind(this))
      if (parsed.validate && parsed.el.tagName === 'FORM') this.applyValidation()
    }
  })
  // DEFINE(DomBuilder.prototype, 'maintainer', {enumerable:false, configurable:false,
  //   get:function(){ return new DomMaintainer(this) }
  // })


  // function DomMaintainer(el){
  //   this.el = el
  //   this.structure = {}
  // }
  // DEFINE(DomMaintainer.prototype, 'include', {enumerable:false, configurable:false,
  //   value:function(el_str, el){ this.structure[el_str] = el }
  // })
  // DEFINE(DomMaintainer.prototype, 'dom', {enumerable:false, configurable:false,
  //   set:function(structure){
  //     Object.keys(structure).map(function(key){
  //       // console.log('DomMaintainer.dom = ',structure)
  //       // console.log('this.el',this.el)
  //       var el
  //       var faker = new DomProxy(el)
  //       if (elDefinitionValidate(key) && key in this.structure) {
  //         el = this.structure[key]
  //         fn.call(faker, this)
  //       }
  //     }.bind(this))
  //   }
  // })

  function DomProxy(el){
    this.el = el
  }
  DomProxy.prototype.addEventListener = function(){}
  DEFINE(DomProxy.prototype, 'value', { configurable:false, enumerable:false,
    set:function(val){ this.el.value = val }
  })



  // DomBuilder.prototype.doModifiers = function(){
  //   for (var i in this.modifiers) {
  //     this.modifiers[i]()
  //   }
  // }
  DomBuilder.prototype.applyValidation = function() {
    // this.modifiers.push(validator.bind(this))
    this.model = new Connected({})
    this.model._new_property_ = ['_valid_', false]
    var builder = this
    var done_for = ['input','textarea']

    var child = this.el.firstChild
    while (child) {
      if (done_for.indexOf(child.tagName.toLowerCase()) != -1 && child.name) {
        this.model._new_property_ = [child.name, '']
        child.addEventListener('input',listener.bind(child))
      }
      child = child.nextSibling
    }
    function listener(){ builder.model[this.name] = this.value }
  }



  /* Takes a CSS selector-style string and generates corresponding real DOM element. */

  function parseElementString(desc){
    var el=null, tag='', id='', classes=[], regex=null, matches=true, properties=[], tokens, validate=false, helpers
    var special_words = ['validate']

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
      switch (true) {
        case (/^\d+$/.test(string)):
          break;

        case (/^(\w[\w.]*)=["']([^'"]*)["']$/.test(string)):

          var property_path
          matches = /^([\w.]+)=["']([^'"]*)["']$/.exec(string)
          property_path = matches[1].split('.')
          property_path.push( matches[2] )
          properties.push( property_path )
          break;

        case (/^[\w-]+$/.test(string)):
          matches = /^[\w-]+$/.exec(string)
          if (special_words.indexOf(matches[1]) !== -1) properties.push( [matches[1], true] )
          break;

        case (/^\w\([^)]+\)$/.test(string)):
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
      // var logit
      // if (prop_path[0] == 'style') { console.log( 'PROCESS PROPERTY PATH:', prop_path ); logit = true }

      var property = properties[prop_path]
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

        data.bind( data, function(keyval, type){
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

})()
