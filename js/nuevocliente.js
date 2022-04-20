// Creamos el IIFE
(function(){
  const formulario = document.querySelector('#formulario');

  document.addEventListener('DOMContentLoaded', () => {
    // Conectarme a la BDD que fue creada en app.js
    conectarDB();

    formulario.addEventListener('submit', validarCliente);
  });

  function validarCliente(e){
    e.preventDefault();

    // Leer los inputs
    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const empresa = document.querySelector('#empresa').value;

    // Validación
    if(nombre === '' || email === '' || telefono === '' || empresa === ''){
      imprimirAlerta('Todos los campos son obligatorios', 'error');
      return;
    }

    // Crear un objeto con la información del cliente
    // Haremos lo contrario al destructuring, es decir, estaremos usando un object literal
    const cliente = {
      nombre: nombre,
      email: email,
      telefono: telefono,
      empresa: empresa,
      id: Date.now()
    };

    crearNuevoCliente(cliente);

  }

  // Función para crear al cliente nuevo. Se le pasa el cliente como un objeto para no tener que pasarle cada valor como un parámetro
  function crearNuevoCliente(cliente){
    // Utilizamos una transacción para usar la conexión abierta
    const transaction = DB.transaction(['crm'], 'readwrite');

    // Creamos el object Store
    const objectStore = transaction.objectStore('crm');

    objectStore.add(cliente);

    transaction.onerror = function(){
      imprimirAlerta('Hubo un error al crear al usuario', 'error');
    }

    transaction.oncomplete = function(){
      imprimirAlerta('Cliente agregado exitosamente');

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    }
  }
})();