
annular.controller('home',function(){

  this.models._new_property_ = ['list', {items: []}]

  this.template = "
  div.small-6.columns
    {to-do}
  "
  this.blocks = {
    "to-do": to_do
  }
})

function to_do(models){
  var items = models.list.items
  this.add('div',function(){
    this.add('ul',function(){
      this.each(models.list,'items',function(id,item){

        this.add('li',function(){
          this.add('input[type="checkbox"]',function(){
            this.onchange(function(ev){
              item.checked = ev.target.value
            })
          })
          this.add('button',function(){
            this.value = 'X'
            this.onclick(function(){
              if (window.confirm('Delete this item?'))
                items.splice( items.indexOf(self), 1 )
            })
          })
          this.add('input[type="text"]',function(){
            this.value = val
            this.onchange(function(ev){
              item.value = ev.target.value
            })
          })
        })

      })
    })
    this.add('button',function(){
      this.value = '+'
      this.onclick(function(){
        models.list.items.push( new this.NewModels.Item() )
      })
    })
    this.add('button',function(){
      this.each(models.list,'items',function(id,item){
        if (item.checked) items.splice( item, 1 )
      })
    })
  })
}
