// Creamos un IIFE
(function(){
  let DB;
  const listadoClientes = document.querySelector('#listado-clientes');

  // Evitar que las variables sean utilizadas por otras funciones
  document.addEventListener('DOMContentLoaded', () => {
    crearDB();

    if(window.indexedDB.open('crm', 2)){
      obtenerClientes();
    }

    listadoClientes.addEventListener('click', eliminarRegistro);
  });

  function eliminarRegistro(e){
    if(e.target.classList.contains('eliminar')){
      const idEliminar = Number(e.target.dataset.cliente);
      
      // Preguntar al usuario si desea eliminar el registro
      // Esta instrucción saca una ventana emergente solicitando la confirmación del usuario. El botón aceptar devuelve true y el botón cancelar devuelve false
      // Buscar la librería sweetalert
      const confirmar = confirm('Deseas eliminar este registro?');

      if(confirmar){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.delete(idEliminar);

        transaction.oncomplete = function(){
          console.log('Eliminando...');

          e.target.parentElement.parentElement.remove();
        }

        transaction.onerror = function(){
          console.log('Ocurrió un error');
        }
      }
    }
  }


  // Crea la BDD de IndexedDB
  function crearDB(){
    // Creando la BDD (Se agrega el nombre y la versión) (Abrimos la conexión)
    const crearDB = window.indexedDB.open('crm', 2);

    // Qué hacemos si da un error (Por lo general es porque el navegador no es compatible)
    crearDB.onerror = function(){
      console.log('Hubo un error');
    };

    // Si se crea la BDD correctamente
    crearDB.onsuccess = function(){

      // Asignamos el resultado de la creación de la BDD a la variable DB
      DB = crearDB.result;
    };

    // Creamos las tablas de la BDD (Recuerda que este código se ejecuta una sola vez)
    crearDB.onupgradeneeded = function(e){
      const db = e.target.result;

      const objectStore = db.createObjectStore('crm', {keyPath: 'id', autoincrement: true});

      objectStore.createIndex('nombre', 'nombre', {unique: false});
      objectStore.createIndex('email', 'email', {unique: true});
      objectStore.createIndex('telefono', 'telefono', {unique: false});
      objectStore.createIndex('empresa', 'empresa', {unique: false});
      objectStore.createIndex('id', 'id', {unique: false});

      console.log('DB Lista y creada');
    };
  }

  function obtenerClientes(){
    // Abrir la conexión
    const abrirConexion = window.indexedDB.open('crm', 2);

    abrirConexion.onerror = function(){
      console.log('Hubo un error');
    };

    abrirConexion.onsuccess = function(){
      DB = abrirConexion.result;

      const objectStore = DB.transaction('crm').objectStore('crm');

      // Vamos a utilizar cursores para obtener la información de la BDD
      objectStore.openCursor().onsuccess = function(e){
        const cursor = e.target.result;

        if(cursor){
          // El cursor se pone en la posición 0 de la BDD, lee los resultados y luego va al siguiente. El cursor es el iterador en este caso
          // Vamos a aplicar un destructuring al objeto para facilitar trabajar con él
          const {nombre, empresa, email, telefono, id} = cursor.value;

          listadoClientes.innerHTML += `
            <tr>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                    <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                    <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                    <p class="text-gray-700">${telefono}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                    <p class="text-gray-600">${empresa}</p>
                </td>
                <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                    <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                    <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                </td>
            </tr>
          `;

          // Traernos el siguiente objeto
          cursor.continue();
        }else{
          console.log('No hay mas registros...');
        }
      }
    }
  }
})();