const telefonoField = document.getElementById('telefono');
const correoField = document.getElementById('correo');
const tarjetaField = document.getElementById('tarjeta');
const expiracionField = document.getElementById('expiracion');
const cvvField = document.getElementById('cvv');
const form = document.getElementById('checkout-form');
const submitButton = document.getElementById('submit-btn');

const validateTelefono = value => value.length === 10 && !isNaN(value);
const validateCorreo = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validateTarjeta = value => value.length === 16 && !isNaN(value);
const validateExpiracion = value => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(value);
const validateCvv = value => value.length === 3 && !isNaN(value);

let cartId = localStorage.getItem('cart') || null;
let token = localStorage.getItem('jwtToken') || null;
let formValid = false; 

submitButton.disabled = true; 

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
const httpRequest = async(uri, message, errorMessage) => {
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.status === 201 || response.status === 200) {
            const responseData = await response.json();
            console.log(responseData); // Agrega este registro para verificar si el ID del carrito se obtiene correctamente
            alert(message)
            return responseData;
        } else {
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}


const validateForm = () => {
    const telefonoValid = validateTelefono(telefonoField.value);
    const correoValid = validateCorreo(correoField.value);
    const tarjetaValid = validateTarjeta(tarjetaField.value);
    const expiracionValid = validateExpiracion(expiracionField.value);
    const cvvValid = validateCvv(cvvField.value);

    if (!telefonoValid) {
        addErrorMessage(telefonoField, 'Por favor, ingrese un número de teléfono válido de 10 dígitos.');
    } else {
        removeErrorMessage(telefonoField);
    }

    if (!correoValid) {
        addErrorMessage(correoField, 'Por favor, ingrese una dirección de correo electrónico válida.');
    } else {
        removeErrorMessage(correoField);
    }

    if (!tarjetaValid) {
        addErrorMessage(tarjetaField, 'Por favor, ingrese un número de tarjeta de crédito válido de 16 dígitos.');
    } else {
        removeErrorMessage(tarjetaField);
    }

    if (!expiracionValid) {
        addErrorMessage(expiracionField, 'Por favor, ingrese una fecha de expiración válida en formato MM/AA.');
    } else {
        removeErrorMessage(expiracionField);
    }

    if (!cvvValid) {
        addErrorMessage(cvvField, 'Por favor, ingrese un CVV válido de 3 dígitos.');
    } else {
        removeErrorMessage(cvvField);
    }

    formValid = telefonoValid && correoValid && tarjetaValid && expiracionValid && cvvValid;
    console.log(formValid)
    submitButton.disabled = !formValid;

    return formValid;
};

form.addEventListener('submit', async event => {
    event.preventDefault();
    if (validateForm()) {
        const purchaseUri = `/api/carts/${cartId}/purchase`;
        const sucessMessage = "Compra realizada con éxito! Gracias por confiar en nosotros.";
        const errorMessage = "Ha habido un error al procesar su compra, por favir, inténtelo de nuevo más tarde";
        const response = await httpRequest(purchaseUri, sucessMessage, errorMessage);
        localStorage.removeItem('cart');
        window.location.href = "products";
        removeErrorMessage(form);
    } else {
        addErrorMessage(form, 'Formulario inválido. Por favor, corrija los errores.')
    }
});

telefonoField.addEventListener('input', () => {
    if (telefonoField.value.length > 0) {
        validateTelefono(telefonoField.value) ? removeErrorMessage(telefonoField) : addErrorMessage(telefonoField, 'Por favor, ingrese un número de teléfono válido de 10 dígitos.');
    }
});

correoField.addEventListener('input', () => {
    if (correoField.value.length > 0) {
        validateCorreo(correoField.value) ? removeErrorMessage(correoField) : addErrorMessage(correoField, 'Por favor, ingrese una dirección de correo electrónico válida.');
    }
});

tarjetaField.addEventListener('input', () => {
    if (tarjetaField.value.length > 0) {
        validateTarjeta(tarjetaField.value) ? removeErrorMessage(tarjetaField) : addErrorMessage(tarjetaField, 'Por favor, ingrese un número de tarjeta de crédito válido de 16 dígitos.');
    }
});

expiracionField.addEventListener('input', () => {
    if (expiracionField.value.length > 0) {
        validateExpiracion(expiracionField.value) ? removeErrorMessage(expiracionField) : addErrorMessage(expiracionField, 'Por favor, ingrese una fecha de expiración válida en formato MM/AA.');
    }
});

cvvField.addEventListener('input', () => {
    if (cvvField.value.length > 0) {
        validateCvv(cvvField.value) ? removeErrorMessage(cvvField) : addErrorMessage(cvvField, 'Por favor, ingrese un CVV válido de 3 dígitos.');
    }
    validateForm(); 
});
