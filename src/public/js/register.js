const nombreField = document.getElementById('nombre');
const apellidoField = document.getElementById('apellido');
const edadField = document.getElementById('edad');
const emailField = document.getElementById('email');
const contraseñaField = document.getElementById('contraseña');
const form = document.getElementById('registerForm');
const submitButton = form.querySelector('button[type="submit"]');

const validateNombre = value => /^[a-zA-Z]+$/.test(value.trim());
const validateApellido = value => /^[a-zA-Z]+$/.test(value.trim());
const validateEdad = value => !isNaN(value) && parseInt(value) >= 18;
const validateEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateContraseña = value => value.length >= 6;
let formValid = false;
submitButton.disabled = true;

const httpRequest = async(uri, message, errorMessage, body) => {
    try {
        showLoadingSpinner();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            requestOptions.body = JSON.stringify(body);
        }

        const response = await fetch(uri, requestOptions);
        
        if (response.status === 201 || response.status === 200) {
            const responseData = await response.json();
            console.log(responseData);
            showToast(message, false)
            hideLoadingSpinner()
            return responseData;
        } else {
            throw new Error(errorMessage);
        }
    } catch (error) {
        hideLoadingSpinner()
        showToast(error, true)
        throw new Error(error);
    }
}


const addErrorMessage = (field, message) => {
    let errorMessage = field.parentNode.querySelector('.text-danger');
    if (!errorMessage) {
        errorMessage = document.createElement('p');
        errorMessage.className = 'text-danger';
        field.parentNode.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
};

const removeErrorMessage = field => {
    const errorMessage = field.parentNode.querySelector('.text-danger');
    if (errorMessage) {
        errorMessage.remove();
    }
};

const validateForm = () => {
    const nombreValid = validateNombre(nombreField.value);
    const apellidoValid = validateApellido(apellidoField.value);
    const edadValid = validateEdad(edadField.value);
    const emailValid = validateEmail(emailField.value);
    const contraseñaValid = validateContraseña(contraseñaField.value);

    if (!nombreValid) {
        addErrorMessage(nombreField, 'Por favor, ingrese su nombre.');
    } else {
        removeErrorMessage(nombreField);
    }

    if (!apellidoValid) {
        addErrorMessage(apellidoField, 'Por favor, ingrese su apellido.');
    } else {
        removeErrorMessage(apellidoField);
    }

    if (!edadValid) {
        addErrorMessage(edadField, 'Debe ser mayor de 18 años para registrarse.');
    } else {
        removeErrorMessage(edadField);
    }

    if (!emailValid) {
        addErrorMessage(emailField, 'Por favor, ingrese una dirección de correo electrónico válida.');
    } else {
        removeErrorMessage(emailField);
    }

    if (!contraseñaValid) {
        addErrorMessage(contraseñaField, 'La contraseña debe tener al menos 6 caracteres.');
    } else {
        removeErrorMessage(contraseñaField);
    }

    formValid = nombreValid && apellidoValid && edadValid && emailValid && contraseñaValid;
    submitButton.disabled = !formValid;

    return formValid;
};

form.addEventListener('submit', async(event) => {
    event.preventDefault();
    if (validateForm()) {
        const data = {
            firstName: nombreField.value,
            lastName: apellidoField.value,
            age: parseInt(edadField.value),
            email: emailField.value,
            password: contraseñaField.value
        };
        const purchaseUri = `/api/auth/register`;
        const sucessMessage = "Nuevo usuario registrado";
        const errorMessage = "Ha habido un error al intentar crear un nuevo usuario, intente nuevamente";
        const response = await httpRequest(purchaseUri, sucessMessage, errorMessage, data);
        console.log('Formulario válido. Enviar datos al servidor.');
    } else {
        addErrorMessage(form, 'Por favor, complete todos los campos correctamente.');
    }
});

nombreField.addEventListener('input', () => {
    validateNombre(nombreField.value) ? removeErrorMessage(nombreField) : addErrorMessage(nombreField, 'Por favor, ingrese su nombre.');
    validateForm();
});

apellidoField.addEventListener('input', () => {
    validateApellido(apellidoField.value) ? removeErrorMessage(apellidoField) : addErrorMessage(apellidoField, 'Por favor, ingrese su apellido.');
    validateForm();
});

edadField.addEventListener('input', () => {
    validateEdad(edadField.value) ? removeErrorMessage(edadField) : addErrorMessage(edadField, 'Debe ser mayor de 18 años para registrarse.');
    validateForm();
});

emailField.addEventListener('input', () => {
    validateEmail(emailField.value) ? removeErrorMessage(emailField) : addErrorMessage(emailField, 'Por favor, ingrese una dirección de correo electrónico válida.');
    validateForm();
});

contraseñaField.addEventListener('input', () => {
    validateContraseña(contraseñaField.value) ? removeErrorMessage(contraseñaField) : addErrorMessage(contraseñaField, 'La contraseña debe tener al menos 6 caracteres.');
    validateForm();
});
