
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
	concise.viewParent = document.body

	new concise.Model('list',[])

	concise.get('/data/todos.json',function(data){
		concise.models.list = data
	})

	var appViews = {
		todosComponent: require('./ui/todo-ui.js'),
		authComponent: require('./ui/auth-form-ui.js')
	}


	/*
	Controllers
	The router runs the ctrl function upon route change.
	*/

	var todosAll = new concise.Controller('todo-all', function(){
		this.view = appViews.todosComponent
	})

	var todosDone = new concise.Controller('todo-complete', function(){
		this.show_when = true
		this.view = appViews.todosComponent
	})

	var todosIncomplete = new concise.Controller('todo-incomplete', function(){
		this.show_when = false
		this.view = appViews.todosComponent
	})

	var home = new concise.Controller('home', function(){
		this.view = appViews.authComponent
	})

	concise.routes
	('/', home)
	('/join', home)
	('/todos', todosAll)
	('/todos-complete', todosDone)
	('/todos-incomplete', todosIncomplete)

	concise.hijackAnchors(true)

})()
