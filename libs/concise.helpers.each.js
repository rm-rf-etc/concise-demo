
module.exports = function each($,data,constructor){
	//console.log( constructor )
	var context = this

	if (! data) throw new Error('Helper received invalid data object with constructor: '+constructor.toString())

	connected.bind(data, function(keyval, type){
		// Further optimizations are likely to come.
		// if (type === 'push') {
		//   constructor.call(o.el, o, keyval[0], keyval[1])
		// }
		// else if (type === 'pop') {
		//   o.el.lastChild.outerHTML = ''
		// }
		$.el.innerHTML = ''
		buildDom()
	})


	function buildDom(){
		Object.keys(data).map(function(key){

			if (typeOf(constructor) === 'Function')
				constructor.call(context, $, key, data[key])

			else if (typeOf(constructor) === 'Object')
				$.dom = constructor

		})
	}
	buildDom()
}
