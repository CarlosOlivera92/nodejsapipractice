const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    showLoadingSpinner()
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            showToast('Inicio de sesión exitoso', false);
            return result.json()
        } 
    }).then(data => {
        localStorage.setItem('jwtToken', data.token)
        window.location.replace('/products');
    }).catch(error => {
        console.error('Ha habido un problema con al iniciar sesión: ', error);
        showToast('Ha habido un problema al iniciar sesión', true);
        hideLoadingSpinner();
    }).finally(() => {
        hideLoadingSpinner();
    });
})



