const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

// crear un promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then( criptomonedas => selectCriptomonedas(criptomonedas) )
}

function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });

}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e) {
    e.preventDefault();

    //validar
    const { moneda, criptomoneda } = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // consultar la api con los resultados
    consultarAPI();


}

function mostrarAlerta(mensaje) {
    
    const error = document.querySelector('.error');
    
    
    if(!error) {
        const divAlerta = document.createElement('div');
        divAlerta.classList.add('error');
        divAlerta.textContent = mensaje;

        formulario.appendChild(divAlerta);

        setTimeout(() => {
            divAlerta.remove();
        }, 2000);
    }
}

function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    // mostrar spinner 
    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacion(cotizacion) {
    limpiar();

     const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

     const precio = document.createElement('p');
     precio.classList.add('precio');
     precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

     const precioAlto = document.createElement('p');
     precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`;
     
     const precioBajo = document.createElement('p');
     precioBajo.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span></p>`;

     const variacion = document.createElement('p');
     precioBajo.innerHTML = `<p>Variacion de las ultimas 24 horas <span>${CHANGEPCT24HOUR}</span>%</p>`;

     const ulitmaActualizacion = document.createElement('p');
     ulitmaActualizacion.innerHTML = `<p>Ultima actualizacion <span>${LASTUPDATE}</span></p>`;

     resultado.appendChild(precio);
     resultado.appendChild(precioAlto);
     resultado.appendChild(precioBajo);
     resultado.appendChild(variacion);
     resultado.appendChild(ulitmaActualizacion);

}

function limpiar() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiar();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>`;

    resultado.appendChild(spinner);

}