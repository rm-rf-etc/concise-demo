
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

    o.view = document.querySelector('#view')

    function getComparator(model, prop1, prop2){
      return function(){ return model[prop1] === model[prop2] }
    }

    o.dom = {
    "row.width-12.column":{
      "section.width-6.centered":function(o){
        var signup_form_el
        var signin_form_el
        var confirm_username_el
        var confirm_password_el

        o.dom = {
        "form 1 validate":function(o){
          signup_form_el = this

          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' pattern='^\\w+@\\w+\\.[\\w.]+[^.]$' required":0,
          "label innerHTML='Confirm Email'":0,
          "input type='email' name='_name' required":function(o){
            confirm_username_el = this
          },
          "label innerHTML='Password'":0,
          "input type='password' name='pass' pattern='.{5,20}' required":0,
          "label innerHTML='Confirm Password'":0,
          "input type='password' name='_pass' pattern='.{5,20}' required":function(o){
            confirm_password_el = this
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
              window.alert('Is valid?', o.el.checkValidity())
            })
          }}


          var test_un = getComparator(o.model,'name','_name')

          o.model.onChange([ 'name', '_name' ], function(){
            confirm_username_el.setCustomValidity( test_un() ? '' : 'Entries do not match.' )
            console.log( o.el.checkValidity() )
          })

          var test_pw = getComparator(o.model,'pass','_pass')

          o.model.onChange([ 'pass', '_pass' ], function(){
            confirm_password_el.setCustomValidity( test_pw() ? '' : 'Entries do not match.' )
            console.log( o.el.checkValidity() )
          })

        },
        "form 2 validate style.display='none' validate":function(o){
          signin_form_el = this

          o.dom = {
          "label innerHTML='Email'":0,
          "input type='email' name='name' required pattern='^\\w+@\\w+\\.[\\w.]+[^.]$'":0,
          "label innerHTML='Password'":0,
          "input type='password' name='pass' required":0,
          "button.left innerHTML='Sign-Up'":function(o){
            o.onClick(function(ev){ ev.preventDefault()
              signin_form_el.style.display = 'none'
              signup_form_el.style.display = 'block'
            })
          },
          "button.right innerHTML='Submit'":function(o){
            o.onClick(function(ev){ ev.preventDefault()
              window.alert('Not implemented yet.')
            })
          }}

        }}

      }

    }}

  })

})();
