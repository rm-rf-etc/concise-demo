
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

    function validEmail(){
      return /^\w+@\w+\.[\w.]+[^.]$/.test( this.name ) && this.name === this._name
    }
    function validPassword(){
      return this.pass == this._pass && this.pass.length > 4 && this.pass.length < 20
    }
    function validForm(){
      this.valid = validEmail.call(this) && validPassword.call(this)
      console.log( 'VALID?', this.valid )
    }

    o.dom = {
      "row.width-12.column":{
        "section.width-6.centered":function(o){
          var signup_form_el
          var signin_form_el
          // Connected.bind(signup_mdl,'name',validForm)
          // Connected.bind(signup_mdl,'_name',validForm)
          // Connected.bind(signup_mdl,'pass',validForm)
          // Connected.bind(signup_mdl,'_pass',validForm)
          o.dom = {
            "form#register":function(o){
              signup_form_el = this
              o.useValidation()
              o.dom = {
                "label1[innerHTML='Email']":0,
                "input1[type='email'][name='name'][pattern='^\\w+@\\w+\\.[\\w.]+[^.]$'][required]":0,
                "label2[innerHTML='Confirm Email']":0,
                "input2[type='email'][name='_name'][required]":0,
                "label3[innerHTML='Password']":0,
                "input3[type='password'][name='pass'][required]":0,
                "label4[innerHTML='Confirm Password']":0,
                "input4[type='password'][name='_pass'][required]":0,
                // "label1":function(){ this.innerHTML = 'Email' },
                // "input1[type='email'][pattern='^\\w+@\\w+\\.[\\w.]+[^.]$'][required]":function(){
                //   var self = this
                //   this.addEventListener('input',function(ev){ signup_mdl.name = self.value })
                // },
                // "label2":function(){ this.innerHTML = 'Confirm Email' },
                // "input2[type='email'][required]":function(){
                //   var self = this
                //   this.addEventListener('input',function(){ signup_mdl._name = self.value })
                // },
                // "label3":function(){ this.innerHTML = 'Password' },
                // "input3[type='password'][required]":function(){
                //   var self = this
                //   this.addEventListener('input',function(){ signup_mdl.pass = self.value })
                // },
                // "label4":function(){ this.innerHTML = 'Confirm Password' },
                // "input4[type='password'][required]":function(){
                //   var self = this
                //   this.addEventListener('input',function(){ signup_mdl._pass = self.value })
                // },
                "button.left[innerHTML='Sign-In']":function(){
                  this.addEventListener('click',function(ev){ ev.preventDefault()
                    signup_form_el.style.display = 'none'
                    signin_form_el.style.display = 'block'
                  })
                },
                "button.right[innerHTML='Submit']":function(){
                  this.addEventListener('click',function(ev){ ev.preventDefault()
                    window.alert('Not implemented yet.')
                  })
                }
              }
            },
            "form#login":function(o){
              signin_form_el = this
              this.style.display = 'none'
              o.useValidation()
              o.dom = {
                "label1[innerHTML='Email']":0,
                "input1[type='email'][name='name'][required][pattern='^\\w+@\\w+\\.[\\w.]+[^.]$']":0,
                "label2[innerHTML='Password']":0,
                "input2[type='password'][name='pass'][required]":0,
                "button.left[innerHTML='Sign-Up']":function(){
                  this.addEventListener('click',function(ev){ ev.preventDefault()
                    signin_form_el.style.display = 'none'
                    signup_form_el.style.display = 'block'
                  })
                },
                "button.right[innerHTML='Submit']":function(){
                  this.addEventListener('click',function(ev){ ev.preventDefault()
                    window.alert('Not implemented yet.')
                  })
                }
              }
            }
          }
        }
      }
    }

  })

})();
