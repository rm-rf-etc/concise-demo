
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

*/


/**
 * This function is called by the controller constructor.
 * Return an object and Concise creates the view from it.
 * Here you can also add controller event listeners.
 */
module.exports = function(ctrl){
	var signup_form_el
	var signin_form_el
	var name_$
	var name_conf_$
	var pass_$
	var pass_conf_$
	var test_name
	var test_pass
	var concise = require('concise')

	// The 'active' event happens when the user navigates to the route for the controller.
	ctrl.onActive(function(){
		if (signup_form_el.style.display === 'none') {
			signin_form_el.style.display = 'none'
			signup_form_el.style.display = 'block'
		}
	})

	// Create the view and attach all the view logic.
	return {
		"div.width-12.column":{
			'a.auth-me href="#" innerHTML="skip login"':function(self){
				self.onClick(function(ev){ ev.preventDefault(); concise.controllers['todos-all']() })
			},
			'h1 innerHTML="Welcome"':0,
			'div.width-6.centered':{
				"form 1 validate":function(C$){
					signup_form_el = C$.el
					C$.dom = {
					"label innerHTML='Email'":0,
					"input type='email' name='name' required":function(C$){ name_$ = C$ },
					"label innerHTML='Confirm Email'":0,
					"input type='email' name='_name' dataset.error='none' required":function(C$){ name_conf_$ = C$ },
					"label innerHTML='Password'":0,
					"input type='password' name='pass' pattern='.{5,20}' required":function(C$){ pass_$ = C$ },
					"label innerHTML='Confirm Password'":0,
					"input type='password' name='_pass' pattern='.{5,20}' dataset.error='none' required":function(C$){ pass_conf_$ = C$ },
					"button.left innerHTML='Sign-In'":gotoSignin,
					"button.right innerHTML='Submit'":signupSubmit,
					}
					test_name = getComparator(C$.model,'name','_name')
					test_pass = getComparator(C$.model,'pass','_pass')
					setupErrorIndicator(name_$, name_conf_$, test_name)
					setupErrorIndicator(pass_$, pass_conf_$, test_pass)
					setupPassConfField(C$)
				},
				"form 2 validate style.display='none'":function(C$){
					signin_form_el = C$.el
					C$.dom = {
					"label innerHTML='Email'":0,
					"input type='email' name='name' required":0,
					"label innerHTML='Password'":0,
					"input type='password' name='pass' pattern='.{5,20}' required":0,
					"button.left innerHTML='Sign-Up'":gotoSignup,
					"button.right innerHTML='Submit'":signinSubmit
					}
					C$.model.onChange(['name', 'pass'], function(){
						console.log( 'Sign-in form is valid? ' + C$.el.checkValidity() )
					})
				}
			}
		}
	}


	function signinSubmit(C$){
		C$.onClick(function(ev){ ev.preventDefault()
			window.alert('Form is valid? ' + signin_form_el.checkValidity())
		})
	}

	function signupSubmit(C$){
		C$.onClick(function(ev){
			ev.preventDefault()
			window.alert('Form is valid? ' + signup_form_el.checkValidity())
		})
	}

	function gotoSignin(C$){
		C$.onClick(function(ev){
			ev.preventDefault()
			signup_form_el.style.display = 'none'
			signin_form_el.style.display = 'block'
		})
	}

	function gotoSignup(C$){
		C$.onClick(function(ev){ ev.preventDefault()
			signin_form_el.style.display = 'none'
			signup_form_el.style.display = 'block'
		})
	}

	function setupErrorIndicator(C$a, C$b, test){
		var updateErrorState = function(){ C$b.el.dataset.error = test() ? 'none' : 'invalid' }
		C$a.onBlur(updateErrorState)
		C$b.onBlur(updateErrorState)
		C$b.onFocus(function(){ C$b.el.dataset.error = 'none' })
	}

	function getComparator(model, prop1, prop2){
		return function(){ return model[prop1] === model[prop2] }
	}

	function setupPassConfField(C$){
		C$.model.onChange([ 'name', '_name' ], function(){
			name_conf_$.setValid( test_name(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+C$.el.checkValidity() )
		})
		C$.model.onChange([ 'pass', '_pass' ], function(){
			pass_conf_$.setValid( test_pass(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+C$.el.checkValidity() )
		})
	}

}
