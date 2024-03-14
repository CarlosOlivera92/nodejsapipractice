const form = document.getElementById('loginForm');

form.addEventListener('submit', e => {
    e.preventDefault();
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
            return result.json()
        } 
    }).then(data => {
        localStorage.setItem('jwtToken', data.token)
        window.location.replace('/products');
    }).catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
})