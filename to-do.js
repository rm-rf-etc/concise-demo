
;(function(){

  annular.controller('home',function(){

    var list_of_items = [
      {checked:false, text:'buy almond milk'}
    , {checked:false, text:'schedule dentist appointment'}
    , {checked:false, text:'breakup with Katey'}
    ]

    this.models._new_property_ = ['list', list_of_items]

    this.view = "\n\
    div.width-6.columns.centered\n\
      {to-do}"

    this.widgets = {
      "to-do": todoWidget
    }
  })


  function todoWidget(){
    var self = this
    var models = this.models
    var list = this.models.list

    this.el('div.list-editor',function(){
      this.el('form',function(){
        var text_input = this.el('input[type="text"][name="new-item-field"]')
        this.el('input[type="submit"]')
        this.onsubmit(function(ev){
          ev.preventDefault()
          list.push({checked:false, text:text_input.value})
        })
      })

      this.el('ul',function(){
        this.each(models,'list',function(id,item){
          this.el('li',listObject(self,list,id,item))
        })
      })

      this.el('button#delete.right',function(){
        this.innerHTML = 'clear completed'
        this.onclick(function(){
          self.each(models,'list',function(id,item){
            if (this.checked) models.list.splice( models.list.indexOf(item), 1 )
          })
        })
      })

    })
  }

  function listObject(self,list,id,item){

    return function(){

      this.el('input[type="checkbox"]',function(){
        this.onclick(function(ev){
          item.checked = this.checked
          console.log(item)
        })
      })

      this.el('button.delete-this',function(){
        this.innerHTML = 'x'
        this.onclick(function(){
          if (confirm('Delete this item?'))
            list.splice( list.indexOf(item), 1 )
        })
      })

      this.el('input[type="text"]',function(){
        this.value = item.text
        this.onchange(function(ev){
          item.text = ev.target.value
          console.log(item)
        })
      })

    }

  }

})();
