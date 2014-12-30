
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
    var models = annular.models
    var list = annular.models.list

    this.dom = {
      'div.list-editor':{
        'form':function(){
          var text_input
          this.dom = {'input[type="text"][name="new-item-field"]':function(){ text_input = this }}
          this.dom = {'input[type="submit"]':0}
          function onSubmit(ev){
            ev.preventDefault()
            console.log(text_input.value)
            // list.push({checked:false, text:text_input.value})
          }
          this.addEventListener('submit',onSubmit)
        }
      },
      'ul each(models.list)':function(id,item){ this.dom = {
        'li':{
          'input[type="checkbox"]':function(){
            this.addEventListener('click',function(ev){
              item.checked = this.checked
              console.log(item)
            })
          },
          'button.delete-this':function(){
            this.innerHTML = 'x'
            this.addEventListener('click',function(){
              if (confirm('Delete this item?'))
                list.splice( list.indexOf(item), 1 )
            })
          },
          'input[type="text"]':function(){
            this.value = item.text
            this.addEventListener('input',function(ev){
              item.text = ev.target.value
              console.log(item)
            })
          }
        }
      }},
      'button#delete.right':function(){
        this.innerHTML = 'clear completed'
        this.addEventListener('click',function(){
          self.each(models,'list',function(id,item){
            if (this.checked) models.list.splice( models.list.indexOf(item), 1 )
          })
        })
      }
    }

  }

})();
