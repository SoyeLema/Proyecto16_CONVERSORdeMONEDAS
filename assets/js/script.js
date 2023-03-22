//VARIABLES//
const input = document.getElementById("input")
const select = document.getElementById("select")
const btn = document.getElementById("convertir")
const graficoX = document.getElementById("grafico")
const error = document.querySelector(".error")


const apiURL = "https://mindicador.cl/api/";
/* const apiLocal = "assets/js/mindicador.json"; */

let chart;


//FUNCION PARA OBTENER LOS DATOS DE LA API//
async function getMonedas() {
    try {
        const endpoint = apiURL + select.value;
        const info = await fetch(endpoint);
        const monedas = await info.json();
        console.log("API disponible - objeto original de la API: ", monedas);
        filtroFechas(monedas);
        filtroCalc(monedas)

    }
    catch {
        console.log("API no disponible")
        error.innerHTML = `ERROR 503: La Base de Datos no está disponible en este momento. Inténtalo más tarde`
        /* alert("Es posible que los valores estén desactualizados debido a que el servicio no se encuentra online.") */
        /*  const endpoint = apiLocal;
            const info = await fetch(endpoint);
            const monedas = await info.json();
            console.log("Objeto local de Api: ", monedas);
            filtroFechas(monedas);
            filtroCalc(monedas); */
        //PROFE ESTO NO ME RESULTÓ
        //QUERÍA QUE FUERA MÁS CREATIVO EL CATCH
        //PERO NO FUNCIONÓ
        //ASÍ QUE ME APEGUÉ A LA RÚBRICA Y USÉ EL CATCH PARA MOSTRAR EL ERROR EN EL DOM
    }
}

//CALCULO DE CAMBIO DE MONEDA-----------------------------

function filtroCalc(data) {
    let arrayCalc = [];
    for (i = 0; i < 1; i++) {
        arrayCalc.push(data.serie[i]);
    }
    /* console.log("MIRA AQUÍ SI ESTÁ FUNCIONANDO!!!")
    console.log(arrayCalc); */
    calcular(arrayCalc);
}

function calcular(data) {
    const resultado = document.querySelector("#result");
    const selectValue = data.map((e) => {
        return e.valor;
    });
    const inputValue = parseFloat(input.value);
    const result = inputValue / selectValue;
    const resultConComa = result.toFixed(2).replace(".", ",")
    resultado.innerHTML = "$" + resultConComa; // Limitar a 2 decimales
    /* console.log("comprobando el resultadooooo" + "$" + result.toFixed(2)) */
}

//--------------------------------------------------------------

//FILTRO POR FECHAS PARA LOS 10 DATOS DEL GRÁFICO---------------

function filtroFechas(data) {
    let arrayFechas = [];
    for (i = 0; i < 10; i++) {
        arrayFechas.push(data.serie[i]);
    }
    /* console.log(arrayFechas); */
    renderGrafico(arrayFechas);

}

//CREACIÓN DEL GRÁFICO-------------------------------------------
function renderGrafico(data) {

    if (chart) {
        chart.destroy();
    }
    graficoX.style.backgroundColor = "white"

    const ejeX = data.map((e) => {
        return e.fecha.slice(0, 10);
    })
    ejeX.reverse();

    const ejeY = data.map((e) => {
        return e.valor;
    })
    ejeY.reverse();

    chart = new Chart(graficoX, {
        type: 'line',
        data: {
            labels: ejeX,
            datasets: [{
                label: 'Historial últimos 10 días.',
                data: ejeY,
                borderWidth: 2,
            }],
        },
        options: {
            backgroundColor: ['rgba(242,49,49)'],
            borderColor: ['rgb(49,210,242,255)'],
        }

    });

}
//------------------------------------------------------------------------

//EVENTO AL CLICK EN BOTON ---------------------------------------------
btn.addEventListener("click", async () => {
    if (input.value < 0 || input.value == "") {
        alert("DEBES INGRESAR UN NÚMERO ENTERO POSITIVO")
    } else {
        getMonedas();//SE LLAMA A LA FUNCIÓN PRINCIPAL QUE CONTIENE TODAS LAS FUNCIONES DEL SITIO
    }
})