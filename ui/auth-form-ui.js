

module.exports = function(ctrl){

	var signup_form_el
	var signin_form_el
	var name_$
	var name_conf_$
	var pass_$
	var pass_conf_$
	var test_name
	var test_pass

	ctrl.onActive(function(){
		if (signup_form_el.style.display === 'none') {
			signin_form_el.style.display = 'none'
			signup_form_el.style.display = 'block'
		}
	})

	return {
		"div.width-12.column":{
			'a.auth-me href="/todos" innerHTML="skip login"':0,
			'h1 innerHTML="Welcome"':0,
			'div.width-6.centered':{
				"form 1 validate":function($){
					signup_form_el = $.el
					$.dom = {
					"label innerHTML='Email'":0,
					"input type='email' name='name' required":function($){ name_$ = $ },
					"label innerHTML='Confirm Email'":0,
					"input type='email' name='_name' dataset.error='none' required":function($){ name_conf_$ = $ },
					"label innerHTML='Password'":0,
					"input type='password' name='pass' pattern='.{5,20}' required":function($){ pass_$ = $ },
					"label innerHTML='Confirm Password'":0,
					"input type='password' name='_pass' pattern='.{5,20}' dataset.error='none' required":function($){ pass_conf_$ = $ },
					"button.left innerHTML='Sign-In'":gotoSignin,
					"button.right innerHTML='Submit'":signupSubmit,
					}
					test_name = getComparator($.model,'name','_name')
					test_pass = getComparator($.model,'pass','_pass')
					setupErrorIndicator(name_$, name_conf_$, test_name)
					setupErrorIndicator(pass_$, pass_conf_$, test_pass)
					setupPassConfField($)
				},
				"form 2 validate style.display='none'":function($){
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
		}
	}


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

	function setupErrorIndicator($a, $b, test){
		var updateErrorState = function(){ $b.el.dataset.error = test() ? 'none' : 'invalid' }
		$a.onBlur(updateErrorState)
		$b.onBlur(updateErrorState)
		$b.onFocus(function(){ $b.el.dataset.error = 'none' })
	}

	function getComparator(model, prop1, prop2){
		return function(){ return model[prop1] === model[prop2] }
	}

	function setupPassConfField($){
		$.model.onChange([ 'name', '_name' ], function(){
			name_conf_$.setValid( test_name(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+$.el.checkValidity() )
		})
		$.model.onChange([ 'pass', '_pass' ], function(){
			pass_conf_$.setValid( test_pass(), 'Entries do not match.' ); console.log( 'Sign-up form is valid? '+$.el.checkValidity() )
		})
	}

}
