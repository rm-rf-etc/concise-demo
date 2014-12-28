
annular.controller('home',function(){

  this.models._new_property_ = ['list', {items: []}]
  this.models._new_property_ = ['test', 1234567890]

  this.template = "\n\
  div.small-6.columns\n\
    {to-do}"

  this.widgets = {
    "to-do": to_do
  }
})

function to_do(){
  var self = this

  this.add('div.special',function(){
    this.add('ul',function(){
      this.add('button',function(){
        this.innerHTML = 'Click on me.'
        this.onclick(function(){
          alert('Proof of concept: '+self.models.test)
        })
      })
    })
  })
}
// function to_do(models){
//   var items = models.list.items
//   this.add('div',function(){
//     this.add('ul',function(){
//       this.each(models.list,'items',function(id,item){

//         this.add('li',function(){
//           this.add('input[type="checkbox"]',function(){
//             this.onchange(function(ev){
//               item.checked = ev.target.value
//             })
//           })
//           this.add('button',function(){
//             this.value = 'X'
//             this.onclick(function(){
//               if (window.confirm('Delete this item?'))
//                 items.splice( items.indexOf(self), 1 )
//             })
//           })
//           this.add('input[type="text"]',function(){
//             this.value = val
//             this.onchange(function(ev){
//               item.value = ev.target.value
//             })
//           })
//         })

//       })
//     })
//     this.add('button',function(){
//       this.value = '+'
//       this.onclick(function(){
//         models.list.items.push( new this.NewModels.Item() )
//       })
//     })
//     this.add('button',function(){
//       this.each(models.list,'items',function(id,item){
//         if (item.checked) items.splice( item, 1 )
//       })
//     })
//   })
// }
