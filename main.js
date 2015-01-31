
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


  var TodoCtrl = new concise.Controller('todo', function($){

    var list = new Bindable([
      {checked:false, text:'buy almond milk'}
    , {checked:false, text:'schedule dentist appointment'}
    , {checked:false, text:'breakup with Katey'}
    ])
    connected.name('list',list)

    $.dom = uis.todo(list)

  })



  var HomeCtrl = new concise.Controller('home', function($){
    $.dom = uis.authForm()
  })


  concise.routes([
    ['/', HomeCtrl]
  , ['/todos', TodoCtrl]
  ])


})();
