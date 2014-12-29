
;(function(){
  var annular

  window.annular = annular = new Annular()



  /* Template parsing algorithm */

  function generateHtml(){
    var lines = this.template.split('\n')
    var line, opening_indent_length, opening_indent_string, spaces, curr_level, prev_level, path, els, el, widget

    for (var i in lines) {
      line = lines[i]
      if (/^\s*\n?$/.test(line)) lines.splice(i,1)
    }

    opening_indent_length = lines[0].match(/\s\s/g).length
    opening_indent_string = new Array(opening_indent_length + 1).join('  ')
    path = []
    els = []

    prev_level = 1
    for (var i in lines) {
      if (lines[i].slice(0,opening_indent_length*2) !== opening_indent_string)
        throw new Error('Invalid indentation in template string. Subsequent indents must not un-indent to lower than opening indent: '+lines[i])

      line = lines[i].replace(opening_indent_string,'')
      curr_level = /\s\s/g.test(line) ? line.match(/\s\s/g).length+1 : 1

      if (line.match(/\s\n?$/g))
        throw new Error('Invalid indentation in template string. Trailing white space found: '+line)

      if (line.match(/\s/g) && line.match(/\s/g).length % 2)
        throw new Error('Invalid indentation in template string. Indented odd number of spaces: '+line)

      if (prev_level+1 < curr_level)
        throw new Error('Invalid indentation in template string: '+line)

      if (/{[\w-]+}/g.test(line)) {
        widget = this.widgets[ /{([\w-]+)}/g.exec(line)[1] ]
        el = widget._el
      } else {
        el = htmlFromDesc(line.replace(/\s+/g,''))
      }

      if (curr_level === 1) {
        path = [el]
        els.push(el)
      } else if (curr_level > prev_level) {
        path[ path.length-1 ].appendChild(el)
        path.push(el)
      } else if (curr_level === prev_level) {
        path[ path.length-2 ].appendChild(el)
        path[ path.length-1 ] = el
      } else {
        path = path.splice(0, curr_level)
        path[ path.length-2 ].appendChild(el)
        path[ path.length-1 ] = el
      }
      prev_level = curr_level
    }

    return els
  }


  /* Takes a CSS selector-style string and generates corresponding real DOM element. */

  function htmlFromDesc(desc){
    var el=null, tag='', id='', classes=[], type='', regex=null, matches=true, properties={}, props=''

    if (/{[\w-]+}/g.test(desc))
      throw new Error("htmlFromDesc() received a widget identifier.")

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



  /*

  Classes

  */

  function ElementWrapper(el){
    this._el = el || null
    this._is_parent = !el
  }
  ElementWrapper.prototype.appendChild = function(el){
    this._el.appendChild(el)
  }
  ElementWrapper.prototype.el = function(el_string,fn){
    var el = htmlFromDesc(el_string)
    var wrapped = new ElementWrapper(el)
    if (fn) fn.apply(wrapped)
    if (this._is_parent) {
      if (! this._el) this._el = el
      else throw new Error("Cannot invoke this.el() more than once in the widget parent scope. Must have only one parent DOM element per widget.")
    }
    else this._el.appendChild(el)
    return wrapped
  }
  ElementWrapper.prototype.each = function(obj,prop,fn){
    var keys, key
    keys = Object.keys(obj[prop][0])
    for (var i in keys) {
      key = keys[i]
      fn.call(this,key,obj[prop][0][key])
    }
  }
  ElementWrapper.prototype.onchange = function(fn){
    this._el.addEventListener('input',function(ev){fn.call(this,ev)})
  }
  ElementWrapper.prototype.onsubmit = function(fn){
    this._el.addEventListener('submit',function(ev){fn.call(this,ev)})
  }
  ElementWrapper.prototype.onclick = function(fn){
    this._el.addEventListener('click',function(ev){fn.call(this,ev)})
  }
  Object.defineProperties(ElementWrapper.prototype,{
    innerHTML: {
      get:function(){return this._el.innerHTML}
    , set:function(val){this._el.innerHTML = val}
    }
    , value: {
      get:function(){return this._el.value}
    , set:function(val){this._el.value = val}
    }
  })



  function Annular(){
    this._container = new CrossTalk.Binding([])
    this.models = this._container.bindable
  }
  Annular.prototype.controllers = {}
  Annular.prototype.controller = function(name, constructor){

    annular.controllers[name] = constructor

    constructor.apply(this)

    for (var name in this.widgets) {
      el = new ElementWrapper()
      el.models = this.models
      fn = this.widgets[name]
      fn.apply(el)

      this.widgets[name] = el
    }

    var html = generateHtml.apply(this)
    for (var i in html)
      document.querySelector('#body').appendChild(html[i])
  }

})()
