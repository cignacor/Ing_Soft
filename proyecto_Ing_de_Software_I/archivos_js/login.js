document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    try {
        const rol = document.getElementById('tipo_persona').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validar que todos los campos estén completos
        if (!rol || !email || !password) {
            alert("Por favor complete todos los campos");
            return;
        }

        // Enviar datos al servidor para autenticación
        fetch('../archivos_php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tipo_persona: rol,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Guardar información del usuario en localStorage
                localStorage.setItem('sicau_user', JSON.stringify(data.user));

                // Redirigir basado en el tipo de usuario
                window.location.href = data.redirect;
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Error al procesar el login: " + error.message);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar el login: " + error.message);
    }
});

// Agregar funcionalidad para mostrar información del sistema
document.addEventListener('DOMContentLoaded', function() {
    console.log("Sistema SICAU - Login cargado");
    console.log("Redirigiendo basado en tipo de usuario");

    // Mostrar información del sistema en consola
    console.log("=== SICAU - Sistema de Reservas Universitarias ===");
    console.log("✅ 6 departamentos académicos");
    console.log("✅ 27 espacios disponibles");
    console.log("✅ Sistema de reservas completo");
    console.log("✅ Base de datos MySQL integrada");
    console.log("✅ Responsive design");
});
