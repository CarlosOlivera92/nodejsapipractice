const socket = io();
const delUserForm = document.getElementById('delUserForm');
const usersList = document.getElementById('users-list');

// Escuchar el evento que devuelve la lista de todos los usuarios
socket.on('allUsers', (users) => {
    usersList.innerHTML = ''; // Borra el contenido actual
    console.log(users);
    users.forEach(user => {
        const userItem = `
            <div class="user">
                <h3>ID: ${user._id}</h3>
                <p>Nombre: ${user.first_name} ${user.last_name}</p>
                <p>Rol: ${user.role}</p>
                <form id="updateRoleForm-${user._id}" class="update-role-form">
                    <select name="rol" class="form-select mb-2">
                        <option value="admin">Admin</option>
                        <option value="premium">Premium</option>
                        <option value="usuario">Usuario</option>
                    </select>
                    <button type="button" class="btn btn-primary btn-sm me-2">Modificar Rol</button>
                </form>
                <form id="delUserForm-${user._id}" class="delete-user-form">
                    <button type="button" class="btn btn-danger btn-sm">Eliminar Usuario</button>
                </form>
            </div>
        `;
        usersList.innerHTML += userItem;

        // Agregar un evento de clic para modificar el rol del usuario
        const updateRoleForm = document.getElementById(`updateRoleForm-${user._id}`);
        updateRoleForm.querySelector('button').addEventListener('click', () => {
            updateRole(user._id);
        });

        // Agregar un evento de clic para eliminar el usuario
        const delUserForm = document.getElementById(`delUserForm-${user._id}`);
        delUserForm.querySelector('button').addEventListener('click', () => {
            deleteUser(user._id);
        });
    });
});

const updateRole = (userId) => {
    // Emitir un evento al servidor para actualizar el rol del usuario
    const updateRoleForm = document.getElementById(`updateRoleForm-${userId}`);
    const selectedRole = updateRoleForm.querySelector('.form-select').value;
    alert(selectedRole)

    // Hacer una solicitud de actualización al servidor utilizando fetch
    fetch(`/api/users/premium/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: selectedRole })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al actualizar el rol del usuario');
        }
        // Actualizar el rol del usuario en el cliente

    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al actualizar el rol del usuario');
    });
};

// Función para eliminar un usuario
const deleteUser = (userId) => {
    // Hacer una solicitud de eliminación al servidor utilizando fetch
    fetch(`/api/users/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    });
};
