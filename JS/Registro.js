// Capturamos el form y creamos un contenedor para mensajes
const form = document.getElementById('registro-form');

// Crear contenedor para mensajes de éxito/error
const formSection = document.querySelector('.form-section');
const messageDiv = document.createElement('div');
messageDiv.className = 'form-message';
formSection.insertBefore(messageDiv, form);

// Regex básico para validar email
const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const numSocio = document.getElementById('num-socio').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validaciones
    if (!nombre || !email || !numSocio || !password) {
        showMessage('Por favor completa todos los campos.', 'error');
        return;
    }

    if (!email.match(emailPattern)) {
        showMessage('Correo electrónico no válido.', 'error');
        return;
    }

    // Obtener usuarios existentes
    let sociosDB = JSON.parse(localStorage.getItem('sociosDB')) || [];

    // Verificar si ya existe el email o número de socio
    const emailExists = sociosDB.some(socio => socio.email === email);
    const numSocioExists = sociosDB.some(socio => socio.numeroSocio === numSocio);

    if (emailExists || numSocioExists) {
        showMessage('El correo o número de socio ya están registrados.', 'error');
        return;
    }

    // Guardar nuevo usuario con la clave correcta y todos los campos
    const newSocio = {
        nombre: nombre,
        email: email,
        numeroSocio: numSocio,
        password: password,
        telefono: "No especificado", // Datos iniciales
        fechaIngreso: new Date().toLocaleDateString('es-CR'), // Fecha de hoy
        tipoMembresia: "Socio Nuevo" // Tipo de membresía inicial
    };
    
    sociosDB.push(newSocio);
    localStorage.setItem('sociosDB', JSON.stringify(sociosDB));

    // Mostrar mensaje de éxito
    showMessage('¡Registro exitoso! Redirigiendo al login...', 'success');

    // Limpiar form
    form.reset();

    // Redirigir después de 2 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
});

// Función para mostrar mensaje (sin cambios)
function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.opacity = '1';
    setTimeout(() => {
        messageDiv.style.opacity = '0';
    }, 4000);
}