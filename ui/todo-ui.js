
module.exports = function(list){

  var new_item_input

  return {
    'div.width-12.columns.centered':{
      'a href="/" innerHTML="Sign-up"':0,
      'div.width-6.columns.centered':{
        'div.list-editor':{
          'form':function($){
            formLogic($)
            $.dom = {
            'input.full-width type="text" name="new-item-field"':function(){
              new_item_input = this
            },
            'input type="submit"':0
            }
          }
        },
        'ul each(list)':function($,id,item){
          var _ = forEachItem($,id,item)
          $.dom = {
            'li':{
              'input type="checkbox"':_.checkbox,
              'button.delete-this innerHTML="&times;"':_.button,
              'input type="text"':_.input
            }
          }
        },
        "button#delete.right innerHTML='clear completed'":deleteButton
      }
    }
  }


  function formLogic($){
    $.onSubmit(function(ev){
      ev.preventDefault()
      list.push({ checked:false, text:new_item_input.value })
      new_item_input.value = ''
    })
  }


  function deleteButton($){
    $.onClick(function(){
      function removeCompleted(item, idx){
        if (item.checked) list.splice( list.indexOf(item), 1 )
        else idx++

        if (idx < list.length) removeCompleted(list[idx], idx)
      }
      removeCompleted(list[0], 0)
    })
  }


  function forEachItem($,id,item){

    return {

      checkbox: function($){
        $.el.checked = item.checked

        item.bind(item,'checked',function(val){ $.el.checked = item.checked })

        $.onClick(function(ev){ item.checked = $.el.checked })
      },

      button: function($){
        $.onClick(function(){
          if (confirm('Delete this item?')) list.splice( list.indexOf(item), 1 )
        })
      },

      input: function($){
        item.fieldManager(function(input_handler, output_handler){

          $.onInput(function(ev){
            input_handler(function(){ item.text = $.el.value })
          })

          item.bind(item,'text',function(val){
            output_handler(function(){ $.el.value = val })
          })

        })
        $.el.value = item.text
      }
    }

  }

}
