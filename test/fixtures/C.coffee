class C1
	constructor: () ->
		console.log 'This is C1'
	sayHello:()->
		console.log 'Hello from C1'

class C2 extends C1
	constructor: () ->
		console.log 'This is C2'
	sayHello:()->
		console.log 'Hello from C2'
	
