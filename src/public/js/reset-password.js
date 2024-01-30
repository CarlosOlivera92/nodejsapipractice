const form = document.getElementById('resetPasswordForm');
const tokenInput = document.getElementById('tokenInput'); // Nuevo

// Captura el token de la URL
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const token = params.token;

// Establece el valor del token en el campo oculto
tokenInput.value = token;

const resetPassword = (data) => {
    fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(data)), // Convierte FormData a objeto
    })
    .then(async (response) => {
        if (response.status === 201 || response.status === 200) {
            return response.json();
        }
        throw new Error('Error al cambiar la contraseña');
    })
    .then((data) => {
        alert('Contraseña actualizada correctamente');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al cambiar la contraseña');
    });
};

form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);

    resetPassword(data);
});