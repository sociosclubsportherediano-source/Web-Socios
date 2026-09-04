// login.js

const loginForm = document.getElementById('login-form');
const messageDiv = document.querySelector('.form-message');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const numSocioInput = document.getElementById('num-socio-login').value.trim();
    const passwordInput = document.getElementById('password-login').value.trim();

    // Validar que los campos no estén vacíos
    if (!numSocioInput || !passwordInput) {
        showMessage('Por favor completa todos los campos.', 'error');
        return;
    }

    // Obtener todos los usuarios registrados
    const sociosDB = JSON.parse(localStorage.getItem('sociosDB')) || [];

    // Buscar socio que coincida con número de socio y contraseña
    const socio = sociosDB.find(s => s.numeroSocio === numSocioInput && s.password === passwordInput);

    if (socio) {
        // Guardar el número de socio como "sesión activa"
        localStorage.setItem('loggedInSocioNumber', socio.numeroSocio);
        showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        // Redirigir al panel privado después de 2 segundos
        setTimeout(() => {
            window.location.href = 'panel.html';
        }, 2000);
    } else {
        showMessage('Número de socio o contraseña incorrectos.', 'error');
    }
});

// Función para mostrar mensajes dentro del form
function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.opacity = '1';

    // Desaparece después de 4 segundos
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 4000);
}