
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

The only time you EVER need a semi-colon for statement termination:
;[1,2,3].map(function(val){ 'do stuff' })
;(function(){ 'do stuff' })

*/

var filter = {
	'true': {
		'true': 'block',
		'false': 'none'
	},
	'false': {
		'true': 'none',
		'false': 'block'
	},
	'undefined': {
		'true': 'block',
		'false': 'block'
	}
}


/**
 * This function is called by the controller constructor.
 * Simply return an object and Concise creates the view from it.
 * Here you can also add controller event listeners.
 */
module.exports = function(ctrl){
	var concise = require('concise')
	var models = concise.models
	var show_when = ctrl.show_when

	// Create the view and attach all the view logic.
	return {
		'div.width-12.column':{

			'a.auth-me href="#" innerHTML="login / register"':function(self){
				self.onClick(function(ev){ ev.preventDefault(); concise.controllers['auth']() })
			},
			'h1 innerHTML="To-Do\'s"':0,

			// Include a partial.
			'div.nav':require('./partials/nav')(),

			'div.width-6.columns.centered':{
				'div.list-editor':{
					'form':function(C$){
						formLogic.call(this,C$)
						C$.dom = {
						'input.full-width type="text" name="new-item-field"':this.newItemInput,
						'input type="submit"':0
						}
					}
				},

				// Invoke the each() helper, calling the func on every item in `concise.models.list`.
				'ul each(list)':function(C$,id,item){

					// Use fn.call() to share `this`, our context object.
					onEach.call(this,C$,id,item)
					var ul_parent = this

					C$.dom = { // Continue adding child nodes.
					'li':function(C$){
						ul_parent.liChild(C$)
						C$.dom = {
						'input type="checkbox"':ul_parent.itemCheckbox,
						'button.delete-this innerHTML="&times;"':ul_parent.itemDelete,
						'input type="text"':ul_parent.itemInput
						}
					}
					}
				},
				"button#delete.right innerHTML='clear completed'":deleteButton
			}
		}
	}



	function formLogic(C$){
		var new_item_input = null

		C$.onSubmit(function(ev){
			ev.preventDefault()
			models.list.push({ checked:false, text:new_item_input.value })
			new_item_input.value = ''
		})

		this.newItemInput = function(C$){
			new_item_input = C$.el
		}
	}


	function deleteButton(C$){
		C$.onClick(function(){
			function removeCompleted(item, idx){
				if (item.checked) models.list.splice( models.list.indexOf(item), 1 )
				else idx++

				if (idx < models.list.length) removeCompleted(models.list[idx], idx)
			}
			removeCompleted(models.list[0], 0)
		})
	}


	function onEach(C$,id,item){

		this.liChild = function(C$){
			C$.el.style.display = filter[show_when][item.checked]

			item.bind('checked',function(){
				C$.el.style.display = filter[show_when][item.checked]
			})
		}

		this.itemCheckbox = function(C$){
			C$.el.checked = item.checked

			item.bind('checked',function(val){ C$.el.checked = item.checked })

			C$.onClick(function(ev){ item.checked = C$.el.checked })
		}

		this.itemDelete = function(C$){
			C$.onClick(function(){
				if (confirm('Delete this item?')) models.list.splice( models.list.indexOf(item), 1 )
			})
		}

		this.itemInput = function(C$){
			var wrap = item.fieldManager()

			C$.onInput(inputHandler)
			item.bind('text',outputHandler)

			function inputHandler(ev){
				wrap.input(function(){ item.text = C$.el.value })
			}
			function outputHandler(val){
				wrap.output(function(){ C$.el.value = val })
			}

			C$.el.value = item.text
		}

	}

}
