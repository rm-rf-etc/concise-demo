
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

  concise.controller('home',function(o){

    var list_of_items = [
      {checked:false, text:'buy almond milk'}
    , {checked:false, text:'schedule dentist appointment'}
    , {checked:false, text:'breakup with Katey'}
    ]

    this.models._new_property_ = ['list', list_of_items]

    o.dom = {
      'div.width-6.columns.centered':todoWidget
    }
  })


  function todoWidget(o){
    var self = this
    var models = concise.models
    var list = concise.models.list

    o.dom = {
      'div.list-editor':{
        'form':function(o){
          var text_input
          o.dom = {
            'input[type="text"][name="new-item-field"]':function(){
              text_input = this
            },
            'input[type="submit"]':0
          }
          this.addEventListener('submit',function(ev){
            ev.preventDefault()
            console.log(text_input.value)
            // list.push({checked:false, text:text_input.value})
          })
        }
      },
      'ul each(models.list)':function(o,id,item){ o.dom = {
        'li':{
          'input[type="checkbox"]':function(){

            concise.models.bind(item,'checked',function(val){
              this.checked = item.checked
            }.bind(this))

            this.addEventListener('click',function(ev){
              item.checked = this.checked
            }.bind(this))

          },
          'button.delete-this':function(){
            this.innerHTML = 'x'
            this.addEventListener('click',function(){
              // if (confirm('Delete this item?')) list.splice( list.indexOf(item), 1 )
              console.log( item )
            })
          },
          'input[type="text"]':function(){
            var field = this
            this.value = item.text

            CrossTalk.fieldManager(function(input_handler, output_handler){

              this.addEventListener('input',function(ev){
                input_handler(function(){ item.text = field.value })
              })
              concise.models.bind(item,'text',function(val){
                output_handler(function(){ field.value = val })
              })

            })
          }
        }
      }},
      'button#delete.right':function(o){
        this.innerHTML = 'clear completed'
        this.addEventListener('click',function(){
          list.map(function(item){
            if (this.checked) list.splice( list.indexOf(item), 1 )
          })
        })
      }
    }

  }

})();
