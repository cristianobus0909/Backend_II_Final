const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    
    if (!obj.email || !obj.password) {
        return Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor, completa todos los campos obligatorios.',
        });
    }

    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(result => {
        if (result.ok) {
            result.json().then(json =>{
                localStorage.setItem("authToken", json.token)
            })
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido a tu perfil.',
                showConfirmButton: false,
                timer: 2000,
            }).then(() => {
                window.location.replace("/api/sessions/profile");
            });
        } else {
            return result.json().then(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el inicio de sesión',
                    text: error.message || 'Usuario o contraseña incorrectos.',
                });
            });
        }
    })
    .catch(error => {
        Swal.fire({
            icon: 'error',
            title: 'Error en el servidor',
            text: 'Hubo un problema con el inicio de sesión. Inténtalo más tarde.',
        });
        console.error('Error en la solicitud:', error);
    });
});
