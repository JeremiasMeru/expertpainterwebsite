
function addFormValidation(formElement) {

	if (formElement === null || formElement.tagName.toUpperCase() !== 'FORM') {
		throw new Error("first parameter must be a FORM, but got " + formElement.tagName);
	}

	formElement.addEventListener("submit", function (evt) {
		if (!validateForm(evt.target)) {
			evt.preventDefault();
		}
	});

	for (var i = 0; i < formElement.length; i += 1) {
		var field = formElement[i];
		field.addEventListener('blur', function (evt) {
			validateField(evt.target);
		});
	}
}

function validateForm(formElement) {
	var error = false;

	for (var i = 0; i < formElement.length; i += 1) {
	 	var isValid = validateField(formElement[i]);
	 	if ( ! isValid) { 
	 		error = true;
	 	}
	}

	return !error;
}


function validateField(el) {
	var error = "";

	if (el.type === "submit" || 
		el.type === "reset" || 
		el.type === "button" || 
		el.tagName.toUpperCase() === "BUTTON") {
		return true; // buttons are automatically valid.
	}

	// find this element's match error div.
	var errorDiv = document.querySelector("#" + el.id + "-error");
	if (errorDiv === null) {
		throw new Error("could not find error element to match #" + el.id, el);
	}

	errorDiv.innerHTML = "";

	if (el.classList) {
	  el.classList.remove('invalid');
	} else {
	  el.className = el.className.replace(/(^|\b)invalid(\b|$)/gi, ' ');
	}

	if (el.type === "email" && el.value.length > 1 && !isEmail(el.value)) {
		error = "please provide a valid email address.";
	}

	if (el.className.indexOf("fv-minlength-") > -1) {
		var pos = el.className.indexOf("fv-minlength-");
		var minLength = parseInt( el.className.substr(pos+13), 10);
		if (el.value.length < minLength) {
			error = "must be " + minLength + " or more characters long.";
		}
	}

	// is this field required?
	if (el.required) { 
		if (el.type === "checkbox" && !el.checked) {
			error = "this must be checked.";
		} else if (el.value.trim() === "") {
			error = "this field must not be blank.";
		}
	}

	if (error !== "") {
		errorDiv.innerHTML = error;
		if (el.classList) {
		  el.classList.add('invalid');
		} else {
		  el.className += ' invalid';
		}
		return false; // it's invalid
	}

	return true;
}

function isEmail(input) {
	return input.match(/^([a-z0-9_.\-+]+)@([\da-z.\-]+)\.([a-z\.]{2,})$/);
}
	