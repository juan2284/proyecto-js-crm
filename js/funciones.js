let DB;

function conectarDB(){
  // Abrir la conexión. El código para abrir la conexión es el mismo que para crear la BDD
  const abrirConexion = window.indexedDB.open('crm', 2);

  // Si no podemos conectar a la BDD
  abrirConexion.onerror = function(){
    console.log('Hubo un error');
  };

  // Si logramos conectar a la BDD
  abrirConexion.onsuccess = function(){
    // Esto nos mantiene una instancia a la BDD con los métodos disponibles
    DB = abrirConexion.result;
  };
}


function imprimirAlerta(mensaje, tipo){
  // Para que no aparezca el mensaje multiples veces
  const alerta = document.querySelector('.alerta');

  if(!alerta){
    // Crear la alerta
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');

    if(tipo === 'error'){
      divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
    }else{
      divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
    }

    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}