const urlParams = new URLSearchParams(window.location.search);
const cedula = urlParams.get('cedula');

console.log('Cedula:', cedula);