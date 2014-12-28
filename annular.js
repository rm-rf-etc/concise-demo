
;(function(){
  var annular, container

  container = new CrossTalk.Binding([])

  Annular.prototype.controllers = {}
  Annular.prototype.container = new CrossTalk.Binding([])
  Annular.prototype.controller = function controller(name, constructor){
    var self = new Controller()

    self.models = container.bindable

    constructor.apply(self)
    widgetBuilder.apply(self)

    self.controllers[name] = self

    var html = generateHtml.apply(self)
    for (var i in html)
      document.querySelector('#body').appendChild(html[i])
  }

  Controller.prototype = new Annular()
  window.annular = annular = new Annular()


  function Annular(){}
  function Controller(){}


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


  function htmlFromDesc(desc){
    var el=null, tag='', id='', classes=[], regex=null, matches=null

    if (/{[\w-]+}/g.test(desc))
      throw new Error("htmlFromDesc() received a widget identifier.")

    if (/#/g.test(desc) &&/#/g.test(desc).length > 1)
      throw new Error("HTML descriptor cannot contain multiple id's: "+desc)

    if (! /^\w/g.test(desc))
      throw new Error("Descriptor doesn't begin with a tag name: "+desc)

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

    return el
  }


  function widgetBuilder(){
    var fn, el, self

    self = this

    function ElementWrapper(el){
      this._el = el
    }
    ElementWrapper.prototype.appendChild = function appendChild(el){
      this._el.appendChild(el)
    }
    ElementWrapper.prototype.add = function add(el_string,fn){
      var el = htmlFromDesc(el_string)
      var wrapped = new ElementWrapper(el)
      if (fn) fn.apply(wrapped)
      this._el.appendChild(el)
      return wrapped
    }
    ElementWrapper.prototype.onclick = function onclick(fn){
      this._el.addEventListener('click',function(ev){ev.preventDefault(); fn(ev)})
    }
    Object.defineProperties(ElementWrapper.prototype,{
      innerHTML: {
        set:function(val){this._el.innerHTML = val}
      , get:function(){return this._el.innerHTML}
      }
    })


    for (var name in this.widgets) {
      el = new ElementWrapper(document.createElement('div'))
      el.models = this.models
      fn = this.widgets[name]
      fn.apply(el)

      this.widgets[name] = el
    }
  }

})()
