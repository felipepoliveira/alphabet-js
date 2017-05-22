//Require Alphabet global
class AlphabetValidation{
	constructor(){
		this.forms = [];

		//Store all implemented validations
		this.implementedValidations = ["data-v-max", "data-v-min", "data-v-required"];
	}


	/*
	* Add a validated form in alphabet validation object to map 
	*/
	addValidatedForm(form){
		this.forms.push(form);
	}

	/*
	* Add a validation rule
	*/
	add(input, values){

	}
}

//Add the AlphabetValidation in AphabetObject
$Alphabet.V = new AlphabetValidation();

class ValidatedInput{
	constructor(validatedForm, input, rules, messages){
		this.validatedForm = validatedForm;
		this.input = input;
		this.rules = rules;

		//Load the messages
		if(messages){
			this.messages = messages;
		}else{
			this.loadMessages();
		}
	}

	get length(){
		return value.length;
	}

	get value(){
		return this.input.value;
	}

	add(rules){
		//Search for all object rules and put it into the rules object
		for(var name in rules){
			this.rules[name] = rules[name];
		}
	}

	loadMessages(){
		this.messages = [];
	}

	message(validation){
		let msg = this.messages[validation];
		if(msg){
			return msg;
		}else{
			return "Failed on validation: " + validation;
		}
	}

	validate(){
		//Reset the errors
		this.errors = [];

		//Begin the validations
		this.validateMin();

	}

	validateMin(){
		let validationName = "data-v-min";
		let length = this.length;
		let rule = this.rules[validationName];

		if(rule && length < rule){
			this.errors[validationName] = this.message(validationName);
		}else{
			return true;
		}
	}

	validateMax(){
		let validationName = "data-v-max";
		let length = this.length;
		let rule = this.rules[validationName];

		if(rule && length > rule){
			this.errors[validationName] = this.message(validationName);
		}else{
			return true;
		}
	}
}

class ValidatedForm{
	constructor(form){
		this.form = form;

		this.loadInputs();

		//Put submit validation callback when form submit
		this.form.addEventListener('submit', this.validate);
	}

	add(validatedInput){
		this.inputs.push(validatedInput);
	}

	callback(input, error, message){

	}

	getRulesOfInput(input){
		let rules = [];
		let attr;

		//Get all implemented validations in V object and search it to put in the rules
		$Alphabet.V.implementedValidations.forEach(function(iv){
			attr = input.attributes[iv];
			if(attr) rules[attr.name] = attr.value;
		});		

		return rules;
	}

	loadInputs(){
		this.inputs = [];
		let $ = this;
		this.form.querySelectorAll("input, textarea").forEach(function(input){
			$.add(new ValidatedInput(this, input, $.getRulesOfInput(input)));
		});
	}

	validate(e){
		let errors = [];
		//Validate all inputs in form
		this.inputs.forEach(function(input){
			let result = input.validate();
			if(result !== true){
				errors.push(result);
			}
		});
	}
}

//Bootstrap
window.addEventListener("load", function(){

	//Get all forms with 'valid' class
	let $forms = document.querySelectorAll(".valid");
	$forms.forEach(function(form){
		$Alphabet.V.addValidatedForm(new ValidatedForm(form));
	});
});