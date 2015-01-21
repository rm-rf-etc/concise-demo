
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/

window.Connected = require('./libs/connected.js').Connected

;(function(){

  var concise = require('./libs/concise.js')


  var HomeCtrl = new concise.Controller('home', function(o){

    function getComparator(model, prop1, prop2){
      return function(){ return model[prop1] === model[prop2] }
    }

    o.dom = {
    "row.width-12.column":{
      "section.width-6.centered":function(o){
        var signup_form_el
        var signin_form_el
        var name_conf_o
        var pass_conf_o

        o.dom = {
        "form 1 validate":function(o){
          signup_form_el = this

          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' required":0,
          "label innerHTML='Confirm Email'":0,
          "input type='email' name='_name' required":function(o){
            name_conf_o = o
          },
          "label innerHTML='Password'":0,
          "input type='password' name='pass' pattern='.{5,20}' required":0,
          "label innerHTML='Confirm Password'":0,
          "input type='password' name='_pass' pattern='.{5,20}' required":function(o){
            pass_conf_o = o
          },
          "button.left innerHTML='Sign-In'":function(o){
            o.onClick(function(ev){
              ev.preventDefault()
              signup_form_el.style.display = 'none'
              signin_form_el.style.display = 'block'
            })
          },
          "button.right innerHTML='Submit'":function(o){
            o.onClick(function(ev){
              ev.preventDefault()
              window.alert('Form is valid? '+signup_form_el.checkValidity())
            })
          }}


          var test_name = getComparator(o.model,'name','_name')
          var test_pass = getComparator(o.model,'pass','_pass')


          o.model.onChange([ 'name', '_name' ], function(){
            name_conf_o.setValid( test_name(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+o.el.checkValidity() )
          })

          o.model.onChange([ 'pass', '_pass' ], function(){
            pass_conf_o.setValid( test_pass(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+o.el.checkValidity() )
          })

        },
        "form 2 validate style.display='none' validate":function(o){
          signin_form_el = this

          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' required":0,
          "label innerHTML='Password'":0,
          "input type='password' name='pass' pattern='.{5,20}' required":0,
          "button.left innerHTML='Sign-Up'":function(o){
            o.onClick(function(ev){ ev.preventDefault()
              signin_form_el.style.display = 'none'
              signup_form_el.style.display = 'block'
            })
          },
          "button.right innerHTML='Submit'":function(o){
            o.onClick(function(ev){ ev.preventDefault()
              window.alert('Form is valid? '+signin_form_el.checkValidity())
            })
          }}

          o.model.onChange(['name', 'pass'], function(){
            console.log( 'Sign-in form is valid? '+o.el.checkValidity() )
          })

        }}

      }

    }}

  })

  // This is just junk right now. Routing will be implemented soon.
  concise.routes
  ('/', HomeCtrl)

  window.HomeCtrl = HomeCtrl
  HomeCtrl()

})();
