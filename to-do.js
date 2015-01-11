
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
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/


;(function(){

  concise.controller('home',function(o){

    var list_of_items = [
      {checked:false, text:'buy almond milk'}
    , {checked:false, text:'schedule dentist appointment'}
    , {checked:false, text:'breakup with Katey'}
    ]

    this.models._new_property_ = ['list', list_of_items]

    o.view = document.querySelector('#view')

    Functionality(o, function(a){return{
      'div.width-6.columns.centered':{
        'div.list-editor':{
          'form':a.forForm(function(a){return{
            'input[type="text"][name="new-item-field"]':a.newItemInput,
            'input[type="submit"]':0
          }})
        },
        'ul|each(models.list)':a.forEachItem(function(a){return{
          'li':{
            'input[type="checkbox"]':a.inputCheckbox,
            'button.delete-this':a.deleteItemButton,
            'input[type="text"]':a.itemTextInput
          }
        }}),
        'button#delete.right':a.deleteCompleted
      }
    }})

  })


  function Functionality(o, bindMarkup){

    o.dom = bindMarkup({
      forForm: forForm
    , forEachItem: forEachItem
    , deleteCompleted: deleteCompleted
    })

  }
  var list = concise.models.list


  function deleteCompleted(){
    var self = this
    self.innerHTML = 'clear completed'

    self.addEventListener('click',function(){

      function removeCompleted(item, idx){
        if (item.checked) list.splice( list.indexOf(item), 1 )
        else idx++

        if (idx < list.length) removeCompleted(list[idx], idx)
      }
      removeCompleted(list[0], 0)

    })
  }


  function forForm(bindMarkup){return function(o){
    var new_item_input = this

    this.addEventListener('submit',function(ev){
      ev.preventDefault()
      list.push({ checked:false, text:new_item_input.value })
      new_item_input.value = ''
    })

    o.dom = bindMarkup({
      newItemInput: function(){
        new_item_input = this
      }
    })

  }}


  function forEachItem(bindMarkup){return function(o,id,item){

    o.dom = bindMarkup({
      inputCheckbox: function(o){
        var self = this
        self.checked = item.checked

        concise.models.bind(item,'checked',function(val){
          self.checked = item.checked
        })

        self.addEventListener('click',function(ev){
          item.checked = self.checked
        })
      },

      deleteItemButton: function(){
        var self = this
        self.innerHTML = 'x'
        self.addEventListener('click',function(){
          // if (confirm('Delete this item?'))
          list.splice( list.indexOf(item), 1 )
        })
      },

      itemTextInput: function(){
        var field = this

        Connected.fieldManager(function(input_handler, output_handler){

          field.addEventListener('input',function(ev){
            input_handler(function(){ item.text = field.value })
          })

          concise.models.bind(item,'text',function(val){
            output_handler(function(){ field.value = val })
          })

        })

        field.value = item.text
      }
    })

  }}

})();
