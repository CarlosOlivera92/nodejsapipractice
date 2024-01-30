const form = document.getElementById('resetPasswordForm');

const resetPassword = (data) => {

    fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
})