class Alphabet{
	constructor(){

	}
}

class AlphabetUtilities{
	constructor(){}

	isString(v){
		return (typeof v === 'string' || v instanceof String);
	}
}

//The Alphabet global variable
$Alphabet = new Alphabet();

//Put the Utilities object into letter 'U'
$Alphabet.U = new AlphabetUtilities();