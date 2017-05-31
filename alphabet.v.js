//Require Alphabet global
class AlphabetValidation{
	constructor(){
		this.forms = [];

		//Store all implemented validations
		this.implementedValidations = ["eq", "max", "min", "required"];

		this.inputsQuery = "input, textarea";
	}


	/*
	* Add a validated form in alphabet validation object to map 
	*/
	add(form, inputs, autoCallback){
		//Add a validated form into the list in 3 different operations...
		if(form instanceof ValidatedForm){
			this.forms.push(form);
		}else if($Alphabet.U.isDOM(form)){
			this.forms.push(new ValidatedForm(form, inputs, autoCallback));
		}else if($Alphabet.U.isString(form)){
			let $form = document.querySelector(form);
			if($form){
				this.forms.push(new ValidatedForm($form, inputs, autoCallback));
			}else{
				throw "The given query \"" + form + "\" was not capable to find any form to validate";
			}
		}else{
			throw "The variable \"" + form + "\" is not a valid form to validate";
		}

		return this.forms[this.forms.length - 1];
	}

	defaultBeforeValidationCallback(form){
		form.querySelectorAll(".alpha-error").forEach(function(e){
			e.remove();
		});
	}

	defaultValidationCallback(input, errorCode, message){
		let span = document.createElement('span');
		span.classList.add("alpha-error");
		span.innerText = message;
		input.parentElement.insertBefore(span, input.nextSibling);
	}

	get(q){
		let form;
		if($Alphabet.U.isDOM(q)){
			form = q;
		}else if($Alphabet.U.isString(q)){
			form = document.querySelector(q);
			if(!form) throw "The given query \"" + q + "\" was not capable to find any form to validate";
		}else{
			throw "The parameter of this method must be an DOM form or an string with thr query to search it"
		}
		let found = null;
		this.forms.forEach(function(f){
			if(f.form === form){
				found = f;
			}
		});

		return found;
	}

	/*
	* Validate all forms or an specific one
	* @param ValidatedForm|form form 
	*/
	validate(form){
		//If the form was specified
		if(form){
			if(form instanceof ValidatedForm){
				form.validate();
			}else if($Alphabet.U.isDOM(form)){
				
			}
		}
	}

	//CALLBACKS
	beforeValidationCallback(form){
		this.defaultBeforeValidationCallback(form);
	}

	validationCallback(input, errorCode, message){
		this.defaultValidationCallback(input, errorCode, message);
	}
}

//Add the AlphabetValidation in AphabetObject
$Alphabet.V = new AlphabetValidation();

class ValidatedInput{
	constructor(validatedForm, input, rules, messages){
		this.validatedForm = validatedForm;
		this.errors = [];
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
		return this.value.length;
	}

	get value(){
		return this.input.value;
	}

	setRules(rules){
		for(var name in rules){
			console.log("name: " + name + ";rule: " + rules[name]);
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
		let result;

		//Begin the validations
		if((result = this.validateMax()) !== true) this.errors.push(result);	
		if((result = this.validateMin()) !== true) this.errors.push(result);
		if((result = this.validateEquals()) !== true) this.errors.push(result);

		//Call validation callback to client feedback
		let $this = this;
		this.errors.forEach(function(error){
			$Alphabet.V.validationCallback($this.input, error.name, error.message);
		});

		//Check if errors ocurred
		if(this.errors.length > 0){
			return this.errors;
		}else{
			return true;
		}
	}

	validateEquals(){
		let validationName = "eq";
		let rule = this.rules[validationName];

		if(rule){
			//Get the element
			let $input = this.validatedForm.form.querySelector("#"+rule);
			if($input){
				$input = this.validatedForm.get($input);
				if (this.value !== $input.value){
					return {
						name : validationName,
						message : this.message(validationName)
					}
				}else{
					return true;
				}
			}else{
				throw "The given query \"" + rule + "\" was not capable to find any input to match value ";
			}
		}else{
			return true;
		}
	}

	validateMin(){
		let validationName = "min";
		let length = this.length;
		let rule = this.rules[validationName];

		if(rule && length < rule){
			return {
				name : validationName,
				message : this.message(validationName)
			}
		}else{
			return true;
		}
	}

	validateMax(){
		let validationName = "max";
		let length = this.length;
		let rule = this.rules[validationName];

		if(rule && length > rule){
			this.errors.push(
			{
				name : validationName,
				message : this.message(validationName)
			});
		}else{
			return true;
		}
	}
}

class ValidatedForm{
	constructor(form, inputs = null, autoCallback = true){
		this.autoCallback = autoCallback;
		this.errors = [];
		this.form = form;
		this.inputs = inputs;

		//If the inputs is not provided, search it via algorithm
		if(!inputs || this.inputs === null){
			this.loadInputs();
		}

		//Disable form validation
		this.form.attributes.novalidate = "novalidate";

		//Put submit validation callback when form submit
		let $this = this;

		//Prevent submit
		this.form.addEventListener('submit', function(e){
			$this.validate();

			if($this.hasErrors){
				e.preventDefault();
				return false;
			}else{
				return true;
			}
		});
	}

	add(validatedInput, rules, messages){
		//Object
		if($Alphabet.U.isObject(validatedInput)){
			this.inputs.push(validatedInput);
		}
		else if($Alphabet.U.isDOM(validatedInput)){
			this.inputs.push(new ValidatedInput(this, validatedInput, rules, messages));
		}
		else if($Alphabet.U.isString(validatedInput)){
			let $input = this.form.querySelector(validatedInput);
			if($input){
				this.inputs.push(new ValidatedInput(this, $input, rules, messages));
			}else{
				throw "The given query \"" + validatedInput + "\" was not capable to find any input to validate in form " + this.form;
			}
		}

		return this;
	}

	callback(){

	}

	get hasErrors(){
		return (this.errors.length > 0);
	}

	get(input){
		if(isFinite(input)){
			return this.inputs[input];
		}else if($Alphabet.U.isString(input)){
			let $input = document.querySelector(input);
			if($input){ 
				input = $input;
			}else{
				throw "The given query \"" + input + "\" was not capable to find any form to validate";
			}
		}

		let foundInput;
		this.inputs.forEach(function(i){
			if(i.input === input){
				foundInput = i;
				return;
			}
		});

		return foundInput;
	}
	

	getRulesOfInput(input){
		let rules = {};
		let attr;

		//Get all implemented validations in V object and search it to put in the rules
		$Alphabet.V.implementedValidations.forEach(function(iv){
			attr = input.attributes["data-" + iv];
			if(attr) rules[iv] = attr.value;
		});

		return rules;
	}

	loadInputs(){
		this.inputs = [];
		let $this = this;
		this.form.querySelectorAll($Alphabet.V.inputsQuery).forEach(function(input){
			$this.add(new ValidatedInput($this, input, $this.getRulesOfInput(input)));
		});
	}

	validate(e){
		//Reset the errors
		this.errors = [];

		//Call before validation callback
		$Alphabet.V.beforeValidationCallback(this.form);

		//Validate all inputs in form
		let $this = this;
		this.inputs.forEach(function(input){
			let result = input.validate();
			if(result !== true){
				$this.errors.push({"input" : input, "errors" : result});
			}
		});
	}
}

//Bootstrap
window.addEventListener("load", function(){
	//Get all forms with 'valid' class
	let $forms = document.querySelectorAll("form.alpha-valid");
	$forms.forEach(function(form){
		$Alphabet.V.add(new ValidatedForm(form));
	});
});