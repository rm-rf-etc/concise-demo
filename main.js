
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/


;(function(){

  var concise = require('./libs/concise.js')
  var connected = require('./libs/connected.js')
  var Bindable = connected.Bindable
  var uis = {
    todo: require('./ui/todo-ui.js')
  , auth_me: require('./ui/auth-form-ui.js')
  }

  var ctrls = bootstrap() // I wanted routes defined above controller functions, so I put them in a named function.

  concise.routes
  ('/', ctrls.HomeCtrl)
  ('/join', ctrls.HomeCtrl)
  ('/todos', ctrls.TodoAllCtrl)
  ('/todos-complete', ctrls.TodoCheckedCtrl)
  ('/todos-incomplete', ctrls.TodoUncheckedCtrl)

  // This is another style you can use to define routes.
  // concise.routes([
  //   ['/', HomeCtrl()]
  // , ['/todos', TodoCtrl()]
  // ])

  // v For use in debugging.
  window.concise = concise
  window.connected = connected


  function bootstrap(){

    var list = new Bindable([
      { checked:false, text:'buy almond milk' }
    , { checked:false, text:'breakup with Katey' }
    , { checked:false, text:'schedule dentist appointment' }
    , { checked:true,  text:'end world hunger' }
    , { checked:false, text:'go to swimming lessons' }
    , { checked:true,  text:'get my haircut' }
    , { checked:false, text:'enter the super duper sweetstakes' }
    ])
    connected.name('list',list)

    return {

      TodoAllCtrl: new concise.Controller('todo-all', function(){
        this.view = uis.todo(list)
      }),

      TodoCheckedCtrl: new concise.Controller('todo-complete', function(){
        this.view = uis.todo(list,true)
      }),

      TodoUncheckedCtrl: new concise.Controller('todo-incomplete', function(){
        this.view = uis.todo(list,false)
      }),

      HomeCtrl: new concise.Controller('home', function(){
        this.view = uis.auth_me(this)
      })

    }
  }


})();
