
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
  , authForm: require('./ui/auth-form-ui.js')
  }

  var ctrls = controllers() // I wanted routes defined above controller functions, so I put them in a named function.

  concise.routes
  ('/', ctrls.HomeCtrl)
  ('/todos', ctrls.TodoCtrl)

  // This is another style you can use to define routes.
  // concise.routes([
  //   ['/', HomeCtrl()]
  // , ['/todos', TodoCtrl()]
  // ])

  // v For use in debugging.
  window.concise = concise
  window.connected = connected


  function controllers(){

    return {

      TodoCtrl: new concise.Controller('todo', function($){
        var list = new Bindable([
          {checked:false, text:'buy almond milk'}
        , {checked:false, text:'schedule dentist appointment'}
        , {checked:false, text:'breakup with Katey'}
        ])
        connected.name('list',list)
        $.dom = uis.todo(list)
      }),

      HomeCtrl: new concise.Controller('home', function($){
        $.dom = uis.authForm()
      })

    }
  }


})();
