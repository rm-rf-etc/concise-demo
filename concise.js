
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

  window.concise = new Concise()
  var DEFINE = Object.defineProperty


  /*

  Concise Class

  */

  function Concise(){
    this.models = new glue({})
  }

  Concise.prototype.controllers = {}

  Concise.prototype.helpers = Helpers()

  Concise.prototype.controller = function(name, constructor){
    concise.controllers[name] = constructor

    var body = document.querySelector('#body')
    var builder = new DomBuilder(body)
    this.models = concise.models

    constructor.call(this,builder)
  }

  function DomBuilder(el){
    this.just_added = null
    this.el = el
  }
  DEFINE(DomBuilder.prototype, 'dom', {enumerable:false, configurable:false,
    set:function(structure){
      if (typeOf(structure) !== 'Object') throw new Error('Invalid dom structure object.')

      var helper_fn, helper_str, builder, key, value, name, data, el_str, el, first_time


      Object.keys(structure).map(function(key){
        value = structure[key]

        if (! value) return
        if (/\s/g.test(key) && key.match(/\s/g).length > 1) throw new Error('Invalid DOM object definition. Cannot have more than one space character.')

        el_str = key.split(' ')[0]

        el = elFromString(el_str)
        builder = new DomBuilder(el)

        helper_str = key.split(' ')[1]

        if (helper_str) {
          if (typeOf(value) !== 'Function') throw new Error('DOM object "'+key+'" defined with helper method but has no function upon which to apply it.')

          helper_fn = concise.helpers[ helper_str.split('(')[0] ]

          data = /\((.+)\)/g.exec(helper_str)[1]
          data = data.split('.').reduce(function(object, prop){
            return object[prop]
          },concise)

          helper_fn(builder,data,value)
          this.el.appendChild(el)
          this.just_added = el
        }
        else if (typeOf(value) === 'Object') {
          builder.dom = value
          this.el.appendChild(el)
          this.just_added = el
        }
        else if (typeOf(value) === 'Function') {
          value.call(el,builder)
          this.el.appendChild(el)
          this.just_added = el
        }

      }.bind(this))
    }
  })
  DEFINE(DomBuilder.prototype, 'maintainer', {enumerable:false, configurable:false,
    get:function(){ return new DomMaintainer(this) }
  })


  function DomMaintainer(builder){
    this.el = builder.just_added
    // console.log('DomMaintainer constructor:',this.el)
  }
  DEFINE(DomMaintainer.prototype, 'dom', {enumerable:false, configurable:false,
    set:function(struct){
      console.log('DomMaintainer.dom = ',struct)
      console.log('this.el',this.el)
      // Object.keys(struct).map(function(key){
      //   console.log(key)
      // })
    }
  })



  /* Takes a CSS selector-style string and generates corresponding real DOM element. */

  function elFromString(desc){
    var el=null, tag='', id='', classes=[], type='', regex=null, matches=true, properties={}, props=''

    if (/#/g.test(desc) && /#/g.test(desc).length > 1)
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


  function Helpers(){
    return {
      each: function(o,data,constructor){

        data.bind( data, function(event){
          if (event[0] === 'push') constructor.call(o.el, o, event[1], event[2])
        })

        Object.keys(data).map(function(key){
          var maintainer

          if (typeOf(constructor) === 'Function') { //console.log('THE KEY', key)
            constructor.call(o.el, o, key, data[key])
            maintainer = o.maintainer

            concise.models.bind(data, key, function(key,val){
              constructor.call(o.el, maintainer, key, val)
            })
          }
          else if (typeOf(constructor) === 'Object') {
            o.dom = constructor
          }

        })
      }
    }
  }

})()
