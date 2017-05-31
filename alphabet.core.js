class Alphabet{
	constructor(){

	}
}

class AlphabetUtilities{
	constructor(){}

	isDOM(e){
		return (e && e.nodeType)? true : false;
	}

	isInstanceOf(o, clazz){
		return (this.isObject(o) && o.constructor.name === clazz);
	}

	isObject(e){
		return (e && typeof(e) === "object");
	}

	isString(e){
		return (e && (typeof e === 'string' || e instanceof String));
	}
}

//The Alphabet global variable
$Alphabet = new Alphabet();

//Put the Utilities object into letter 'U'
$Alphabet.U = new AlphabetUtilities();