
module.exports = function(){
	var concise = require('concise')
	return {
		'div.row':{
			'button innerHTML="All"':function(self){
				self.onClick(function(){ concise.controllers['todos-all']() })
			},
			'button innerHTML="Incomplete"':function(self){
				self.onClick(function(){ concise.controllers['todos-incomplete']() })
			},
			'button innerHTML="Completed"':function(self){
				self.onClick(function(){ concise.controllers['todos-completed']() })
			},
		}
	}
}
