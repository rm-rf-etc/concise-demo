
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

The only time you EVER need a semi-colon for statement termination:
;[1,2,3].map(function(val){ 'do stuff' })
;(function(){ 'do stuff' })

*/

;(function(){
	var concise = require('concise')
	concise.viewParent = document.querySelector('#concise-app')

	new concise.Model('list',[
		{ "checked":false, "text":"buy almond milk" }
	,	{ "checked":false, "text":"breakup with Katey" }
	,	{ "checked":false, "text":"schedule dentist appointment" }
	,	{ "checked":true,  "text":"end world hunger" }
	,	{ "checked":false, "text":"go to swimming lessons" }
	,	{ "checked":true,  "text":"get my haircut" }
	,	{ "checked":false, "text":"enter the super duper sweetstakes" }
	])

	var appViews = {
		todosComponent: require('./ui/todo-ui.js'),
		authComponent: require('./ui/auth-form-ui.js')
	}


	/*
	Controllers
	The router runs the ctrl function upon route change.
	*/

	var todosAll = new concise.Controller('todos-all', function(){
		this.show_when = undefined
		this.view = appViews.todosComponent
	})

	var todosCompleted = new concise.Controller('todos-completed', function(){
		this.show_when = true
		this.view = appViews.todosComponent
	})

	var todosIncomplete = new concise.Controller('todos-incomplete', function(){
		this.show_when = false
		this.view = appViews.todosComponent
	})

	var auth = new concise.Controller('auth', function(){
		this.view = appViews.authComponent
	})

	todosAll()

})()
