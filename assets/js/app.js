/** 
 * aqui va comntarios de documentacion draggable d
 * @type {sting}
*/
const currentMenuItem = document.querySelector('[data-current-menu-item]');
const scrollContainer = document.querySelector('.content-slider');
const draggable = document.querySelector('.draggable');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const scrollAmount = 295 + 17;

let isDragging = false;
let startX = 0;
let scrollLeft = 0;

/**
 * Permite almacenar en un **array** los valores numericos del **DOM** tales como:
 *
 * 1. Coordenadas **x** del mouse.
 * 2. Coordenadas **y** del mouse.
 * 3. Posición del **Scroll Vertical**.
 * 
 * Y los almacena como un valor de tipo **number**. El cual puede ser calculado por
 * **css** y realizar diversas animaciones con la popiedad **calc()** entre otros.
 * 
 * @typedef {objet} rootItem
 * @property {string} key - Nombre de la propiedad
 * @property {number} data - El valor asociado con la propiedad
 * @property {number} posX - Variable numerica tomada de las coordenadas del mouse en el eje X del mouse y enviada
 * como variable para ser usada en css
 * @property {number} posY - Variable numerica tomada de las coordenadas del mouse en el eje Y del mouse y enviada
 * como variable para ser usada en css
 * @property {number} scrollY - Variable numerica tomada de la posicion vertical del scroll y enviada como variable
 * para ser usada en css
 */

/**
 * Es una lista de objetos que contienen información sobre diversas propiedades del documento y la ventana.
 * Cada objeto tiene una propiedad `key` que describe la propiedad y una propiedad `data` que almacena el valor asociado.
 * 
 * @type {rootItem[]}
 */

let rootItem = [
  { posX: 'posX', data: 0 },
  { posY: 'posY', data: 0 },
  { scrollY: 'scrollY', data: 0 },
  { viewportWidth: 'viewportWidth', data: 0 },
  { viewportHeight: 'viewportHeight', data: 0 },
  { documentWidth: 'documentWidth', data: 0 },
  { documentHeight: 'documentHeight', data: 0 },
  { contentWidth: 'contentWidth', data: 0 },
  { contentHeight: 'contentHeight', data: 0 }
];

let cssString = generateCSS(rootItem);

var idsParaEliminar = [
  'admin-bar-inline-css',
  'wp-emoji-styles-inline-css',
  'classic-theme-styles-inline-css',
  'core-block-supports-inline-css'
];

var parallaxActive = false;

var parallaxState = 'first-parallax';

/**
 * @description
 * Es un array de objetos que define los puntos de ruptura del efecto parallax.
 * Cada objeto contiene un valor de desplazamiento vertical (`scroll_Y`) y un estado (`state`).
 * @type {array<{scroll_Y: number, state: string}>}
 * @property {number} scroll_Y - Punto de quiebre relacionado al scroll vertical en donde
 * scrollTop = 0 y el maximo punto de quiebre es tomado del **viewportHeight** equivalente a 100vh del viewport.
 * 
 * cuando se actualizan las variables este toma el valor del **viewportHeight / 4** Dicho resultado es multiplicado
 * por la posicion del breakPoint.
 * 
 * **Ejemplo:**
 * ****
 * 
 * **const {@link minDimensions}** = getValueFromArray({@link rootItem}, 'viewportHeight') / 4;
 *     
 *   scroll_Y: 0
 * 
 *   scroll_Y: {@link minDimensions}
 * 
 *   scroll_Y: {@link minDimensions} * 2
 * 
 *   scroll_Y: {@link minDimensions} * 3
 * 
 *   scroll_Y: {@link minDimensions} * 4 - 150  
 * 
 * @property {string} state - Hace referencia a la ubicación en la que se encuentra el **scroll_Y** y
 * dependiendo de este se le añade al HTML en el body un atributo llamado: parallaxState
 * 
 * @example  
 * <body parallaxState="first-parallax"></body> | Aparece cuando scroll_Y = 0
 * <body parallaxState="second-parallax"></body> | Aparece cuando scroll_Y = 200
 * <body parallaxState="third-parallax"></body> | Aparece cuando scroll_Y = 400
 * <body parallaxState="fourth-parallax"></body> | Aparece cuando scroll_Y = 600
 * @description
 * > [NOTA]
 * > Cabe resaltar que este atributo es utilizado en css como si fuese class y es
 * tratado como selector para generar dicho efecto de parallax.
 *  ejemplo
 */


var parallaxBreakpoints = [
  { scroll_Y: 0, state: 'first-parallax' },
  { scroll_Y: 200, state: 'second-parallax' },
  { scroll_Y: 400, state: 'third-parallax' },
  { scroll_Y: 600, state: 'fourth-parallax' },
  { scroll_Y: getValueFromArray(rootItem, 'viewportHeight'), state: 'fourth-parallax' }
];

var lazyVideos = [].slice.call(document.querySelectorAll("video"));

// Funciones utilitarias
function eliminarElementosPorID(arrayDeIDs) {
  arrayDeIDs.forEach(function (id) {
    var elemento = document.getElementById(id);
    if (elemento !== null) {
      elemento.remove();
      // console.log(`Eliminado: ${id}`);
    } else {
      // console.log(`No encontrado: ${id}`);
    }
  });
}

function parallaxAnimation(scroll_Y) { // parallax
  // Definir el estado predeterminado en caso de que posY sea mayor que 600
  parallaxState = 'fourth-parallax endParallax';

  // Iterar sobre los puntos de quiebre para determinar el estado del paralaje
  for (const breakpoint of parallaxBreakpoints) {
    if (scroll_Y <= breakpoint.scroll_Y) {
      parallaxState = breakpoint.state;
      break; // Salir del bucle una vez que se haya encontrado el estado adecuado
    }
  }

  /**   
   * @typedef {number} minDimensions
   * es una constante con valor numerico.
   * - Es el valor minimo que sale del resultado de dividir la altura de la pantalla en 4
   *  para poder calcular los estados de breakPoints para parallaxBreakpoints.
   * - La altura de la pantalla en css es tomada por 100vh.
   */

  const minDimensions = getValueFromArray(rootItem, 'viewportHeight') / 4;

  parallaxBreakpoints = [
    { scroll_Y: 0, state: 'fourth-parallax' },
    { scroll_Y: minDimensions, state: 'fourth-parallax dashStroke hide-header' },
    { scroll_Y: minDimensions * 2, state: 'third-parallax hide-header' },
    { scroll_Y: minDimensions * 3, state: 'second-parallax hide-header' },
    { scroll_Y: minDimensions * 4 - 150, state: 'fourth-parallax hide-header' }
  ];

  document.body.setAttribute('parallaxState', parallaxState);
}

function lazyVideoPlay() { // pendiente ajustar no funciona al 100%
  if ("IntersectionObserver" in window) {
    let lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (let source in video.target.children) {
            let videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }
          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
}

function navbarToggler() { // para añadir evento al ejecutar el burguer menu
  // Código a ejecutar al hacer clic en el botón
  const element = document.querySelector('#headerContent');
  element.classList.toggle('show-menu');
  const valueClass = element.classList.contains('show-menu');
  overlayBackdrop(valueClass);
};

function overlayBackdrop(valueClass) {
  if (valueClass) {
    let overlayBackdropEl = document.createElement('overlay-backdrop');
    overlayBackdropEl.setAttribute('data-toggle', 'collapse');
    overlayBackdropEl.setAttribute('data-target', '#navbarSupportedContent');
    overlayBackdropEl.addEventListener('click', navbarToggler);
    document.body.appendChild(overlayBackdropEl);
  } else {
    document.querySelector('overlay-backdrop').remove();
  }
}

function getValueFromArray(array, key) { // Función para obtener el valor de array y key
  const item = array.find(obj => obj[key] !== undefined);
  return item ? item.data : null;
}

function updateArray(array, variableName, dataValue) { // añade o actualiza el array
  const existingIndex = array.findIndex(item => item[variableName] !== undefined);

  const newObj = { [variableName]: variableName, data: dataValue };

  if (existingIndex !== -1) {
    // Reemplazar el objeto existente
    array[existingIndex] = newObj;
  } else {
    // Añadir el nuevo objeto
    array.push(newObj);
  }
  // Generar y aplicar el CSS después de actualizar el array
  applyUpdatedCSS(array);
}

function generateCSS(array) { //crea estructura root con variables css
  let cssString = ':root {\n';

  array.forEach(item => {
    const variableName = Object.keys(item)[0];
    const dataValue = item.data;
    cssString += `  --${variableName}: ${dataValue};\n`;
  });

  cssString += '}';

  return cssString;
}

function applyCSS(cssString) { // crea elemento o actualiza elemento en el DOM 
  let styleElement = document.getElementById('dynamic-styles');

  if (!styleElement) { // Crear el elemento <style> si no existe    
    styleElement = document.createElement('style');
    styleElement.id = 'dynamic-styles';
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = cssString; // Actualizar el contenido del elemento <style>
}

// draggable
function draggableMouseDown(e) {
  isDragging = true;
  startX = e.clientX;
  scrollLeft = scrollContainer.scrollLeft;
  draggable.style.cursor = 'grabbing';
  draggable.classList.add('grabbing');
}

function documentMouseMove(e) {
  if (isDragging) {
    const dx = e.clientX - startX;
    scrollContainer.scrollLeft = scrollLeft - dx;
  }
}

function documentMouseUp() {
  if (isDragging) {
    isDragging = false;
    draggable.style.cursor = 'grab';
    draggable.classList.remove('grabbing');
  }
}

function buttonScroll(amount) {
  scrollContainer.scrollBy({
    left: amount,
    behavior: 'smooth'
  });
}
// draggable


// Funciones principales
function appOnInit() { // inicializar la aplicación
  currentMenuItem && itemParentActive();

  eliminarElementosPorID(idsParaEliminar);

  logDimensions(); // para deectar el ancho de la pantalla

  if (parallaxExists('.parallax-content')) { // Uso de la función detector de parallax
    parallaxActive = true;
    document.body.setAttribute('parallaxState', 'fourth-parallax');
  }

  const button = document.querySelector('.navbar-toggler');
  button.addEventListener('click', navbarToggler);

  if (lazyVideos.length > 0) { // Start loading and playing the first video  
    lazyVideoPlay();
  }
  // console.log('appOnInit');
}

function onInitDOM() { // Se ejecuta al cargar el DOM
  // Aquí se ejecutará después de que el DOM haya sido completamente cargado
  buttonDataUrl();
  // console.log('onInitDOM');
}

function itemParentActive() { // Activa el item padre en el menu
  const element = document.querySelector('[data-current-menu-item]');
  const itemActive = element.getAttribute('data-current-menu-item');
  element.removeAttribute('data-current-menu-item');
  document.querySelector(`[data-parent-item=${itemActive}]`).parentElement.classList.add('current-menu-item', 'active');
}

function parallaxExists(selector) { // validar si hay parallax en el Dom
  return document.querySelector(selector) !== null;
}

function updateScrollVariable() { // Función para actualizar la variable CSS con el valor de desplazamiento vertical
  let scrollTopY = document.querySelector('.content-wrapper').scrollTop;
  updateArray(rootItem, 'scrollY', scrollTopY); // Obtener el valor de desplazamiento vertical
  if (parallaxActive) {
    const scrollYValue = getValueFromArray(rootItem, 'scrollY');
    parallaxAnimation(scrollYValue);
  }
}

/**
 * Esta funcion  es ejecutada por un addEventListener aplicado al window del DOM y que se dispara con el evento mousemove
 * Permite tomar las coordenadas del mouse en el eje X,Y en el DOM para posteriormente ser almacenados
 * como variables y actualizadas en 
 * {@link rootItem }
 * @function  handleMouseMove
*/

function handleMouseMove(event) { // Función para actualizar la variable CSS con el valor de mousemove
  updateArray(rootItem, 'posX', event.clientX); // Coordenada x del cursor del ratón
  updateArray(rootItem, 'posY', event.clientY); // Coordenada y del cursor del ratón
}

/**
 * Esta funcion es ejecutada por un addEventListener aplicado al window del DOM y que se dispara con el evento resize
 * su idea principal era la de almacenar las resoluciones de pantalla pero no se le dio uso a dicha funcionalidad y por
 * el momento solo se está utilizando es para detectar cuando el eslider de casos de exito es muy ancho y este no necesita
 * visualizar los botones de navegacion adelante y atras.
 * @function  logDimensions
 */

function logDimensions() { // detecta resizado en pantalla del DOM
  //No se e está daando uso a estas variables. Tamaño de la ventana del navegador
  updateArray(rootItem, 'viewportWidth', window.innerWidth);
  updateArray(rootItem, 'viewportHeight', window.innerHeight);

  //No se e está daando uso a estas variables. Tamaño del documento completo
  updateArray(rootItem, 'documentWidth', document.documentElement.scrollWidth);
  updateArray(rootItem, 'documentHeight', document.documentElement.scrollHeight);

  //No se e está daando uso a estas variables. Tamaño del contenido del documento
  updateArray(rootItem, 'contentWidth', document.documentElement.offsetWidth);
  updateArray(rootItem, 'contentWidth', document.documentElement.offsetHeight);

  scrollContainer && validateNavSlider(); // solo se ejecuta si existe
}

/**
 * Esta funcion me retorna un valor booleano, **true** o **false** y nos permite determinar el estado en que se
 * encuentra para poder ocultar las Fechas en el **DOM** añadiendo a su contenedor una clase llamada **.hide**
 * la cual oculta dichos botones navegables.
 * 
 * **Flechas**
 * - **[id="left-button"]**
 * - **[id="right-button"]**
 *   
 * **Contenedor**
 * - **[class="nav-slider"]** -> Se le añade una clase llamada **[class="hide"]** la cual oculta dichos botones navegables (**Flechas**).
 * 
 * {@link validateNavSlider}
 * 
 * @function scrollDetect
 * @returns {boolean}
 */

function scrollDetect() {
  return scrollContainer.scrollWidth > scrollContainer.clientWidth;
}

/**
 * Este metodo la funcion principal es tomar lo retornado de {@link scrollDetect} y agregar o quitar la clase css
 * llamada [class="hide"] en el contenedor [class="nav-slider"]
 * @function validateNavSlider
 */

function validateNavSlider() {
  if (scrollDetect()) {
    document.querySelector('.nav-slider').classList.remove('hide');
  } else {
    document.querySelector('.nav-slider').classList.add('hide');
  }
}

function handleOrientationChange() { // se activa al rotar pantalla
  // se tenia para ejecutar logDimensions pero ya no es necesario.
}

function applyUpdatedCSS(array) { // Función que genera y aplica el CSS actualizado
  cssString = generateCSS(array);
  applyCSS(cssString);
}

/**
 * Metodo que permite crear etiquetas link en el head para poder cargar en su href la url del css asociado a su llamada
 * permitiendo tener un uso controlado de carga estilos css y llamandolos cuando son necesitados solamente. 
 * @function createAndInsertLink 
 */

function createAndInsertLink(fileName) {

  // Crear el elemento link    
  const href = `${themeCssUrl}svg_styles/${fileName}.css`;
  const link = document.createElement('link');

  // Configurar los atributos del link
  link.id = fileName;
  link.rel = 'stylesheet';
  link.href = href;
  link.type = 'text/css';
  link.media = 'all';

  // Insertar el link en el head del documento
  document.head.appendChild(link);
}

/**
 * Este metodo asincrono hace un llamado al archivo solicitado tomando su url de un archivo **.txt**. y añadiendo su contenido al
 * [**DOM**](https://developer.mozilla.org/es/docs/Glossary/DOM "Modelo de Objetos del Documento")
 * en la ubicacion donde se realizo su llamada desde el **HTML**.
 * 
 * En el html en la etiqueta donde se requiere hacer la insercion o carga del **svg** se debe añadir:
 * 
 * 1. **class="data-svg"**
 * 2. **data-file-name="svg-nombre-archivo"** sin la necesidad de añadir el formato ya que esto siempre leera archivos **.txt**
 * 
 * **Nota importante para retornar contenido svg:**
 *  
 * 1. debe existir dicho archivo en el directorio:  
 * 
 * - `. / assets / uploads / svgText / svg-nombre-archivo.txt`
 * **** 
 * 2. Debe existir un **archivo css** asociado al archivo con el **mismo nombre** y alojado en el directorio:
 *  
 * - `. / assets / css / konex_css / svg_styles / svg-nombre-archivo.css`
 * 
 * Por ahora los parametros utilizados para carga de archivo svg en el Html son:
 * 
 * - `class="data-svg"`
 * - `data-file-name="svg-nombre-archivo"`
 * 
 * @example
 * <div class="data-svg" data-file-name="svg-nombre-archivo"></div> 
 * 
 * @function cargarArchivo
 * @returns {svg}
 */

async function cargarArchivo(url) { // toma el texto y lo pasa a svg en el DOM
  // const url = 'https://ejemplo.com/archivo.txt'; // Reemplaza con la URL real del archivo de texto
  // console.log('cargarArchivo');
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('La solicitud de red falló');
    }
    return await response.text();
  } catch (error) {
    console.error('Error al cargar el archivo:', error);
    throw error; // Propaga el error para manejarlo más arriba si es necesario
  }
}



// Event listeners
document.addEventListener('DOMContentLoaded', onInitDOM); // Se ejecuta solo al cargar el DOM
window.addEventListener('resize', logDimensions); // Se ejecuta cada vez que la ventana del navegador es redimensionada
document.querySelector('.content-wrapper').addEventListener('scroll', updateScrollVariable);  // se ejecuta cada vez que cambia el scroll
window.addEventListener('mousemove', handleMouseMove); // se ejecuta cada vez que se mueve el mouse
window.addEventListener("orientationchange", handleOrientationChange); // se ejecuta cuando detecta rotacion de pantalla
// document.addEventListener("DOMContentLoaded", includeHTML);
if (scrollContainer) {
  draggable.addEventListener("mousedown", draggableMouseDown);
  document.addEventListener("mousemove", documentMouseMove);
  document.addEventListener("mouseup", documentMouseUp);
  leftButton.addEventListener("click", () => buttonScroll(-scrollAmount));
  rightButton.addEventListener("click", () => buttonScroll(scrollAmount));
}

// Inicialización de la aplicación
appOnInit();

// garga lazy

const dataSvg = document.querySelectorAll('.data-svg');
const dataImg = document.querySelectorAll('.data-img');

/**
 * Metodo dedicado a la carga de archivos de imagen: svg, webp, png, jpg.
 * 
 * Su funcionalidad esta basada en un IntersectionObserver que se ejecuta tan pronto es cargado el DOM y
 * consiste en cargar en forma de carga lazy dichos graficos. Solo si se encuentran visualmente listos
 * para ser mostrados en el DOM de lo contrario no seran cargados hasta no realizar scroll o que estos
 * esten dentro de la ventana del navegador a la vista del usuario.
 * 
 * **¿Como funciona?**
 * 
 * Para que los archivos sean llamados deben desde el html añadir los parametros de carga:
 * 
 * @description 
 * **Pasos para Cargar un svg:**
 * 1. Se debe añadir al elemento contenedor en el HTML una class llamada **class="data-svg"**
 * 2. Se añade el nombre del archivo sin su extensión, `data-file-name="svg-nombre-archivo"`.
 * 
 *    **Atributos Requeridos**
 * - - `class="data-svg"`
 * - - `data-file-name="svg-nombre-archivo"`
 * @example
 * <div class="data-svg" data-file-name="svg-nombre-archivo"></div>
 * @description 
 * **Pasos para Cargar una imagen:**
 * 1. Se debe añadir al elemento contenedor en el HTML una class llamada **class="data-img"**
 * 2. Se añade el nombre del archivo con su extensión, `data-file-name="nombre-archivo.webp"`.
 * 
 *    **Atributos Requeridos**
 * - - `class="data-img"`
 * - - `data-file-name="nombre-archivo.webp"`
 * @example
 * <div class="data-img" data-file-name="nombre-archivo.webp"></div> 
 * @function intersection
 * @param {*} entries - Representa cada elemento observable del DOM que ha sido detectado a partir de las clases css añadidas en el HTML
 * 
 * **{@link dataSvg}**
 * y
 * **{@link dataImg}**
 * ****
 * **{@link dataSvg}** = `<div class="data-svg"></div>`
 * ****
 * **{@link dataImg}** = `<div class="data-img"></div>`
 * @param {*} observer - Por cada elemento detectado se crea un observable y este cuando es cargado o visualizado dejara de estar
 * observandose permitiendo liberar recursos y optimizar la web en el dispositivo o equipo.
 */

function intersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const filename = entry.target.dataset.fileName;
      const nameVar = filename.match(/^[^.]+/)[0];
      let linkId = document.getElementById(filename);
      if (entry.target.classList.contains('data-svg')) {
        !linkId && createAndInsertLink(filename); // si no hay link con ese id lo crea
        const url = `${uploadsUrl}svgText/${filename}.txt`;
        cargarArchivo(url)
          .then(contenido => {
            entry.target.innerHTML = contenido;
            // Hacer algo con el contenido...
          })
          .catch(error => {
            // Manejar errores aquí si es necesario
          });
      } else if (entry.target.classList.contains('data-img')) {
        entry.target.classList.add('loaded');
        entry.target.style = `--${nameVar}: url(${uploadsUrl}images/${filename});background-image: var(--${nameVar});`;
      }
      observer.unobserve(entry.target);
    }
  });
}

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
}

const observer = new IntersectionObserver(intersection, options);

dataSvg.forEach(svgData => {
  observer.observe(svgData);
  // console.log('dataSvg');
});

dataImg.forEach(imgData => {
  observer.observe(imgData);
  // console.log('dataImg');
});
// garga lazy