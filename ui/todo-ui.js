
/*

Semi-colon line terminators are just FUD. If your minifier can't handle this code, switch to one that is JS-compliant.
http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
http://inimino.org/~inimino/blog/javascript_semicolons

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

module.exports = function(ctrl){

	// var list = ctrl.parent.models.list
	// var show_when = ctrl.parent.show_when

	var list = ctrl.models.list
	var show_when = ctrl.show_when

	return {
		'div.width-12.column':{
			'a.auth-me href="/join" innerHTML="login / register"':0,
			'h1 innerHTML="To-Do\'s"':0,
			'div.nav':require('./partials/nav.js'),
			'div.width-6.columns.centered':{
				'div.list-editor':{
					'form':function($){
						formLogic.call(this,$)
						$.dom = {
						'input.full-width type="text" name="new-item-field"':this.newItemInput,
						'input type="submit"':0
						}
					}
				},
				'ul each(list)':function($,id,item){
					onEach.call(this,$,id,item)
					var ul_parent = this
					$.dom = {
					'li':function($){
						ul_parent.liChild($)
						$.dom = {
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



	function formLogic($){
		var new_item_input = null

		$.onSubmit(function(ev){
			ev.preventDefault()
			list.push({ checked:false, text:new_item_input.value })
			new_item_input.value = ''
		})

		this.newItemInput = function($){
			new_item_input = $.el
		}
	}


	function deleteButton($){
		$.onClick(function(){
			function removeCompleted(item, idx){
				if (item.checked) list.splice( list.indexOf(item), 1 )
				else idx++

				if (idx < list.length) removeCompleted(list[idx], idx)
			}
			removeCompleted(list[0], 0)
		})
	}


	function onEach($,id,item){

		this.liChild = function($){
			$.el.style.display = filter[show_when][item.checked]
			item.bind(item,'checked',function(){
				$.el.style.display = filter[show_when][item.checked]
			})
		}

		this.itemCheckbox = function($){
			$.el.checked = item.checked

			item.bind(item,'checked',function(val){ $.el.checked = item.checked })

			$.onClick(function(ev){ item.checked = $.el.checked })
		}

		this.itemDelete = function($){
			$.onClick(function(){
				if (confirm('Delete this item?')) list.splice( list.indexOf(item), 1 )
			})
		}

		this.itemInput = function($){
			item.fieldManager(function(input_handler, output_handler){

				$.onInput(function(ev){
					input_handler(function(){ item.text = $.el.value })
				})

				item.bind(item,'text',function(val){
					output_handler(function(){ $.el.value = val })
				})

			})
			$.el.value = item.text
		}

	}

}
