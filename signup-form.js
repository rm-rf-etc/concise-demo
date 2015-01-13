
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

    // var signin_mdl = new Connected({ name:'', pass:'', valid:false })
    // var signup_mdl = new Connected({ name:'', _name:'', pass:'', _pass:'', valid:false })

    o.view = document.querySelector('#view')

    function validEmail(prop){
      return function() { return /^\w+@\w+\.[\w.]+[^.]$/.test( this[prop] ) }
    }
    function validPassword(prop){
      return function(){ return this[prop].length > 4 && this[prop].length < 20 }
    }
    function emailsMatch(){
      return this.name === this._name
    }
    function passwordsMatch(){
      return this.pass == this._pass
    }

    o.dom = {
      "row.width-12.column":{
        "section.width-6.centered":function(o){
          var signup_form_el
          var signin_form_el
          o.dom = {
            "form 1 validate":function(o){
              signup_form_el = this
              o.dom = {
              "label innerHTML='Email'":0,
              "input type='email' name='name' pattern='^\\w+@\\w+\\.[\\w.]+[^.]$' required":function(o){
                o.validateWith([validEmail('name'), emailsMatch])
              },
              "label innerHTML='Confirm Email'":0,
              "input type='email' name='_name' required":function(o){
                o.validateWith([validEmail('_name'), emailsMatch])
              },
              "label innerHTML='Password'":0,
              "input type='password' name='pass' required":function(o){
                o.validateWith([validPassword('pass'), passwordsMatch])
              },
              "label innerHTML='Confirm Password'":0,
              "input type='password' name='_pass' required":function(o){
                o.validateWith([validPassword('_pass'), passwordsMatch])
              },
              "button.left innerHTML='Sign-In'":function(){
                this.addEventListener('click',function(ev){ ev.preventDefault()
                  signup_form_el.style.display = 'none'
                  signin_form_el.style.display = 'block'
                })
              },
              "button.right innerHTML='Submit'":function(o){
                this.addEventListener('click',function(ev){ ev.preventDefault()
                  window.alert('Is valid?', o.model._valid_)
                })
              }
            }},
            "form 2 validate style.display='none' validate":function(o){
              signin_form_el = this
              o.dom = {
              "label innerHTML='Email'":0,
              "input type='email' name='name' required pattern='^\\w+@\\w+\\.[\\w.]+[^.]$'":function(o){
                o.use([validEmail('name'), emailsMatch])
              },
              "label innerHTML='Password'":0,
              "input type='password' name='pass' required":function(o){
                o.use([validPassword('pass'), passwordsMatch])
              },
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
              }
            }}
          }
        }
      }
    }

  })

})();
