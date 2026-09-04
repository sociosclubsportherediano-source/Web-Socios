// Archivo: socios.js

// **NOTA:** Aquí puedes cambiar el valor para probar.
// 'true' = modo socio (muestra contenido privado)
// 'false' = modo no-socio (oculta contenido privado)
const isLoggedIn = false; 

document.addEventListener('DOMContentLoaded', () => {

    const privateContent = document.querySelector('.private-content');
    
    if (isLoggedIn) {
        // Si el usuario está logueado, muestra el contenido privado
        privateContent.classList.remove('hidden');
    } else {
        // Si no, lo oculta
        privateContent.classList.add('hidden');
    }
});