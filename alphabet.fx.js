if(!isDOM){
	function isDOM(e){
		return (e.nodeType)? true : false;
	}
}

if(!isInstanceOf){
	function isInstanceOf(o, clazz){
		return (isObject(o) && o instanceof clazz);
	}
}

if(!isObject){
	function isObject(e){
		return (e && typeof(e) === "object");
	}
}

if(!isString){
	function isString(e){
		return (typeof v === 'string' || v instanceof String);
	}
}