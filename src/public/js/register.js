const registerForm = document.getElementById("registerForm");

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    if (!obj.email || !obj.password || !obj.first_name || !obj.last_name) {
        return Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios.',
        });
    }

    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(result => {
        if (result.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'Serás redirigido al login.',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.replace("/users/login");
            });
        } else {
            return result.json().then(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    text: error.message || 'Inténtalo nuevamente.',
                });
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: 'Hubo un problema con el registro. Inténtalo más tarde.',
        });
        console.error('Error en la solicitud:', error);
    });
});

    
