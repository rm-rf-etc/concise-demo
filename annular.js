
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

;(function(){

  window.annular = new Annular()


  /*

  Annular Class

  */

  function Annular(){
    this.modelHandler = new CrossTalk.Binding({})
    this.models = this.modelHandler.bindable
    this.helpers = {
      each: function(data,constructor){
        var parent = this

        Object.keys(data).map(function(key){
          var construct = function(key, val){
            if (typeOf(constructor) === 'Function')
              constructor.call(parent, key, val)
            else if (typeOf(constructor) === 'Object')
              parent.dom = constructor
          }

          construct.call(this, data, data[key])

          ;(function(child){
            annular.modelHandler.bind(data,key,function(val){
              console.log('HANDLER',child)
              child.mode = 'match'
              construct.call(parent,data,key)
            })
          })(parent.lastChild)

        })

        parent.mode = 'match'

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
    var mode = 'build'
    Object.defineProperty(obj,'dom',{enumerable:false, configurable:false, set:domBuilder})
    Object.defineProperty(obj,'mode',{enumerable:false, configurable:false,
      get:function(){ return mode }
    , set:function(v){ mode = (v === 'match') ? v : 'build' }
    })
  }
  function domBuilder(obj){
    var helper, keys, key, val, el_and_helper, name, data, el
    if (this.mode === 'match') { console.log('CHECKING',key,this); return }

    keys = Object.keys(obj)
    for (var i in keys) {
      key = keys[i]
      val = obj[key]

      helper = null
      if (/\s/g.test(key)) {
        el_and_helper = key.split(' ')
        if (el_and_helper.length > 2)
          throw new Error('Invalid DOM object definition. Cannot have more than one space character.')
        helper = el_and_helper[1]
        key = el_and_helper[0]
      }

      if (this.mode === 'build') el = elFromString(key)
      else el = this.querySelector(key)

      el.mode = this.mode

      if (! val) childAction.call(this)

      if (helper) {
        // if (typeOf(val) !== 'Function')
        //   throw new Error('DOM object defined with helper method but has no function upon which to apply it.')
        if (val) attachDomMethod(el)

        name = /(\w+)/g.exec(helper)[1]
        data = /\((.+)\)/g.exec(helper)[1]

        data = data.split('.').reduce(function(_data, prop, idx){
          return _data[prop]
        },annular)

        helper = annular.helpers[name]
        helper.call(el,data,val)
        childAction.call(this)
      }
      else if (typeOf(val) === 'Object') {
        domBuilder.call(el,val)
        childAction.call(this)
      }
      else if (typeOf(val) === 'Function') {
        if (this.mode === 'build') attachDomMethod(el)
        val.call(el)
        childAction.call(this)
      }
      function childAction(){
        if (this.mode === 'build') this.appendChild(el)
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

    tag = /^(h[1-6]|[a-z]+)/g.exec(desc)[1]

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
