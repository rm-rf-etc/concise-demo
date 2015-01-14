
/*
The MIT License (MIT)

Copyright (c) 2014 Rob Christian

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*

Semi-colons are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/


;(function(){

  concise.controller('home',function(o){

    // function validEmail(prop, el1, el2){
    //   var msg
    //   return function() {
    //     msg = /^\w+@\w+\.[\w.]+[^.]$/.test(this[prop]) ? '' : 'Input is not a valid email.'
    //     el1.setCustomValidity( msg )
    //     el2.setCustomValidity( msg )
    //     console.log( el1.name, el2.name, 'VALIDITY:', el1.checkValidity(), el2.checkValidity() )
    //   }
    // }
    // function validPassword(prop, el1, el2){
    //   var msg
    //   return function(){
    //     msg = this[prop].length > 4 && this[prop].length < 20 ? '' : 'Password must be between 4 and 20 characters long.'
    //     el1.setCustomValidity( msg )
    //     el2.setCustomValidity( msg )
    //     console.log( el1.name, el2.name, 'VALIDITY:', el1.checkValidity(), el2.checkValidity() )
    //   }
    // }

    o.view = document.querySelector('#view')

    function matches(prop1, prop2, el1, el2){
      var msg
      return function(){
        msg = this[prop1] === this[prop2] ? '' : 'Entries do not match.'
        el1.setCustomValidity( msg )
        el2.setCustomValidity( msg )
        console.log( 'VALIDITY FOR', el1.name, 'AND', el2.name, ':', el1.checkValidity(), el2.checkValidity() )
      }
    }

    o.dom = {
    "row.width-12.column":{
      "section.width-6.centered":function(o){
        var signup_form_el
        var signin_form_el
        var un_o
        var pw_o
        var _un_o
        var _pw_o
        o.dom = {
        "form 1 validate":function(o){
          signup_form_el = this
          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' pattern='^\\w+@\\w+\\.[\\w.]+[^.]$' required":function(o){ un_o = o },
          "label innerHTML='Confirm Email'":0,
          "input type='email' name='_name' required":function(o){ _un_o = o },
          "label innerHTML='Password'":0,
          "input type='password' name='pass' required":function(o){ pw_o = o },
          "label innerHTML='Confirm Password'":0,
          "input type='password' name='_pass' required":function(o){ _pw_o = o },
          "button.left innerHTML='Sign-In'":function(){
            this.addEventListener('click',function(ev){
              ev.preventDefault()
              signup_form_el.style.display = 'none'
              signin_form_el.style.display = 'block'
            })
          },
          "button.right innerHTML='Submit'":function(o){
            this.addEventListener('click',function(ev){
              ev.preventDefault()
              window.alert('Is valid?', o.model._valid_)
            })
          }}
          un_o.validateWith( [ matches('name', '_name', un_o.el, _un_o.el) ] )
          _un_o.validateWith( [ matches('name', '_name', un_o.el, _un_o.el) ] )

          pw_o.validateWith( [ matches('pass', '_pass', pw_o.el, _pw_o.el) ] )
          _pw_o.validateWith( [ matches('pass', '_pass', un_o.el, _un_o.el) ] )
        },
        "form 2 validate style.display='none' validate":function(o){
          signin_form_el = this
          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' required pattern='^\\w+@\\w+\\.[\\w.]+[^.]$'":0,
          "label innerHTML='Password'":0,
          "input type='password' name='pass' required":0,
          "button.left innerHTML='Sign-Up'":function(){
            this.addEventListener('click',function(ev){ ev.preventDefault()
              signin_form_el.style.display = 'none'
              signup_form_el.style.display = 'block'
            })
          },
          "button.right innerHTML='Submit'":function(){
            this.addEventListener('click',function(ev){ ev.preventDefault()
              window.alert('Not implemented yet.')
            })
          }}
        }}
      }
    }}

  })

})();
