

module.exports = function($){

  var signup_form_el
  var signin_form_el
  var name_conf_$
  var pass_conf_$

  $.onActive(function(){
    if (signup_form_el.style.display === 'none') {
      signin_form_el.style.display = 'none'
      signup_form_el.style.display = 'block'
    }
  })

  return {
  "div.width-12.column":{
    'div.nav':require('./partials/nav.js'),
    "div.width-6.centered":{
      "form 1 validate":function($){
        signup_form_el = $.el
        $.dom = {
        "label innerHTML='Email'":0,
        "input type='email' name='name' required":0,
        "label innerHTML='Confirm Email'":0,
        "input type='email' name='_name' required":function($){ name_conf_$ = $ },
        "label innerHTML='Password'":0,
        "input type='password' name='pass' pattern='.{5,20}' required":0,
        "label innerHTML='Confirm Password'":0,
        "input type='password' name='_pass' pattern='.{5,20}' required":function($){ pass_conf_$ = $ },
        "button.left innerHTML='Sign-In'":gotoSignin,
        "button.right innerHTML='Submit'":signupSubmit,
        }
        setupPassConfField($)
      },
      "form 2 validate style.display='none' validate":function($){
        signin_form_el = $.el
        $.dom = {
        "label innerHTML='Email'":0,
        "input type='email' name='name' required":0,
        "label innerHTML='Password'":0,
        "input type='password' name='pass' pattern='.{5,20}' required":0,
        "button.left innerHTML='Sign-Up'":gotoSignup,
        "button.right innerHTML='Submit'":signinSubmit
        }
        $.model.onChange(['name', 'pass'], function(){
          console.log( 'Sign-in form is valid? '+$.el.checkValidity() )
        })
      }
    }
  }}

  function signinSubmit($){
    $.onClick(function(ev){ ev.preventDefault()
      window.alert('Form is valid? '+signin_form_el.checkValidity())
    })
  }

  function signupSubmit($){
    $.onClick(function(ev){
      ev.preventDefault()
      window.alert('Form is valid? '+signup_form_el.checkValidity())
    })
  }

  function gotoSignin($){
    $.onClick(function(ev){
      ev.preventDefault()
      signup_form_el.style.display = 'none'
      signin_form_el.style.display = 'block'
    })
  }

  function gotoSignup($){
    $.onClick(function(ev){ ev.preventDefault()
      signin_form_el.style.display = 'none'
      signup_form_el.style.display = 'block'
    })
  }

  function getComparator(model, prop1, prop2){
    return function(){ return model[prop1] === model[prop2] }
  }

  function setupPassConfField($){
    var test_name = getComparator($.model,'name','_name')
    var test_pass = getComparator($.model,'pass','_pass')

    $.model.onChange([ 'name', '_name' ], function(){
      name_conf_$.setValid( test_name(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+$.el.checkValidity() )
    })

    $.model.onChange([ 'pass', '_pass' ], function(){
      pass_conf_$.setValid( test_pass(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+$.el.checkValidity() )
    })
  }

}
