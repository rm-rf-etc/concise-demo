# Concise.js

(WIP)

_Concise.js_ is a next-gen frontend framework. The general philosophy is to remove as much junk as possible, leaving you with only straight javascript and HTML elements that are immediately alive and interactive the moment they enter the DOM. Concise.js is built upon Connected.js, a never-polling 2-way data binding library.

## Demo

The below example is a to-do app, see [to-do.js](//github.com/rm-rf-etc/concise/blob/master/to-do.js). Connected and Concise don't yet support a variety of array methods, aside from push(). The goal right now is to get these methods working, along with the DomMaintainer functionality which updates the to-do list as a whole.

``` javascript
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
            list.push({checked:false, text:text_input.value})
            console.log('Item appended:',list)
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
            field.value = item.text

            glue.fieldManager(function(input_handler, output_handler){

              field.addEventListener('input',function(ev){
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
```

## License

Concise.js is available under the [MIT License](//github.com/rm-rf-etc/concise/blob/master/LICENSE.txt).
