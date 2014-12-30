
;(function(){

  annular.controller('home',function(){

    var list_of_items = [
      {checked:false, text:'buy almond milk'}
    , {checked:false, text:'schedule dentist appointment'}
    , {checked:false, text:'breakup with Katey'}
    ]

    this.models._new_property_ = ['list', list_of_items]

    this.dom = {
      'div.width-6.columns.centered':todoWidget
    }
  })


  function todoWidget(){
    var self = this
    var models = this.models
    var list = this.models.list

    this.dom = {
      'div.list-editor':{
        'form':function(){
          var text_input
          this.dom = {'input[type="text"][name="new-item-field"]':function(){ text_input = this }}
          this.dom = {'input[type="submit"]':null}
          function onSubmit(ev){
            ev.preventDefault()
            list.push({checked:false, text:text_input.value})
          }
          this.onsubmit(onSubmit)
        }
      },
      'ul::each(models.list)':function(id,item){ this.dom = {
        'li':{
          'input[type="checkbox"]':function(){
            this.onclick(function(ev){
              item.checked = this.checked
              console.log(item)
            })
          },
          'button.delete-this':function(){
            this.innerHTML = 'x'
            this.onclick(function(){
              if (confirm('Delete this item?'))
                list.splice( list.indexOf(item), 1 )
            })
          },
          'input[type="text"]':function(){
            this.value = item.text
            this.onchange(function(ev){
              item.text = ev.target.value
              console.log(item)
            })
          }
        }
      }},
      'button#delete.right':function(){
        this.innerHTML = 'clear completed'
        this.onclick(function(){
          self.each(models,'list',function(id,item){
            if (this.checked) models.list.splice( models.list.indexOf(item), 1 )
          })
        })
      }
    }

  }

})();
