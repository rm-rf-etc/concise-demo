
module.exports = function(list){

  return {
    'div.width-12.columns.centered':{
      'a href="/" innerHTML="Sign-up"':0,
      'div.width-6.columns.centered':{
        'div.list-editor':{
          'form':function($){
            var new_item_input

            $.onSubmit(function(ev){
              ev.preventDefault()
              list.push({ checked:false, text:new_item_input.value })
              new_item_input.value = ''
            })
            $.dom = {
            'input.full-width type="text" name="new-item-field"':function(){
              new_item_input = this
            },
            'input type="submit"':0
            }
          }
        },
        'ul each(list)':forEachItem(function(a){return{
          'li':{
            'input type="checkbox"':a.inputCheckbox,
            'input type="text"':a.itemTextInput,
            'button.delete-this innerHTML="&times;"':a.deleteItemButton
          }
        }
        }),
        "button#delete.right innerHTML='clear completed'":function($){
          $.onClick(function(){
            function removeCompleted(item, idx){
              if (item.checked) list.splice( list.indexOf(item), 1 )
              else idx++

              if (idx < list.length) removeCompleted(list[idx], idx)
            }
            removeCompleted(list[0], 0)
          })
        }
      }
    }
  }


  function forEachItem(bindMarkup){

    return function($,id,item){

      $.dom = bindMarkup({
        inputCheckbox: function($){
          $.el.checked = item.checked

          item.bind(item,'checked',function(val){ $.el.checked = item.checked })

          $.onClick(function(ev){ item.checked = $.el.checked })
        },

        deleteItemButton: function($){
          $.onClick(function(){
            if (confirm('Delete this item?')) list.splice( list.indexOf(item), 1 )
          })
        },

        itemTextInput: function($){
          var field = this

          item.fieldManager(function(input_handler, output_handler){

            $.onInput(function(ev){
              input_handler(function(){ item.text = field.value })
            })

            item.bind(item,'text',function(val){
              output_handler(function(){ field.value = val })
            })

          })

          field.value = item.text
        }
      })

    }
  }

}
