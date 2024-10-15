/**
 * desde PHP se envia la url actual donde se encuentra alojado el poryecto
 * está se almacena como urlVars y esto
 * @typedef {Array} urlVars
 * @property {string} siteUrl - Url del sitio
 * @property {string} homeUrl - Url del sitio
 * @property {string} postSlug - Url del sitio
 * 
 * @example
 * demo
 */
var urlVars;
// cargar imagenes segun el módulo que se necesite
const themeCssUrl = `${urlVars.siteUrl}/wp-content/themes/theme_konex_web/assets/css/konex_css/`;
/**
 * Ruta utilizada para cuando se desea cargar javascript al importar un archivo html y
 * este contiene su propio javascript. Esto se encuentra incompleto y no se le dio uso
 * ya que al momento de cargar el contenido en la web se veia demorada la carga del contenido html.
 * @type {string} 
 */
const themeJsUrl = `${urlVars.siteUrl}/wp-content/themes/theme_konex_web/assets/html/`;
const uploadsUrl = `${urlVars.siteUrl}/wp-content/themes/theme_konex_web/assets/uploads/`;
/**
 * variable utilizada para identificar el módulo o seccion que se ha cargado al ejecutar el proyecto
 * @type {string}
 */
const postSlug = urlVars.postSlug;

const htmlInclude = document.querySelector('[data-html-include]');

// cargar html externo
// pendiente revisa cuando se cargan svg o imagenes ya que no las carga en lazy por el asincrono
async function includeHTML() {
    const elements = document.querySelectorAll('[data-html-include]');
    const elementsToProcess = elements.length;

    if (elementsToProcess === 0) { // No hay elementos para procesar
        return;
    }

    const promises = Array.from(elements).map(async elmnt => {
        const nameFile = elmnt.getAttribute("data-html-include");
        // console.log(elmnt.getAttribute("data-js-import"));
        const jsImport = elmnt.getAttribute("data-js-import");
        const file = `${urlVars.siteUrl}/wp-content/themes/theme_konex_web/assets/html/${nameFile}.html`;

        try {
            const response = await fetch(file);
            if (response.status === 200) {
                const text = await response.text();
                elmnt.innerHTML = text;
            } else if (response.status === 404) {
                elmnt.innerHTML = "Page not found.";
            }
            // -> Elementos procesados con includeHTML 
            jsImport && createAndInsertScript(nameFile, elmnt);            
            elmnt.removeAttribute("data-html-include");
            buttonDataUrl();
        } catch (error) {
            console.error('Error loading file:', error);
        }
    });

    await Promise.all(promises);
    // -> todos los elemenos se han procesado
}

function createAndInsertScript(fileName, elmnt) {
    // Crear el elemento script    
    const src = `${themeJsUrl}/${fileName}.js`;
    const script = document.createElement('script');

    // Configurar los atributos del script
    const nameId = fileName.split('/');
    const lastPart = nameId.pop();
    script.id = lastPart;
    script.src = src;
    script.type = 'text/javascript';
    script.defer = true;

    // Insertar el script en el head del documento
    document.head.appendChild(script);
    elmnt.removeAttribute("data-js-import");
    
}

// cargar html externo
function htmlOnInit() {
    htmlInclude && includeHTML();
}

function buttonDataUrl() { // metodo que redirije a url
    const buttons = document.querySelectorAll('.data-url');
    // console.log('buttonDataUrl', buttons.length);
    buttons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevenir el comportamiento predeterminado
            const buttonUrl = this.getAttribute('data-url');  // Obtiene la URL del atributo data-url del botón
            var fullUrl = '';  // Concatena las URLs
            if (buttonUrl.startsWith('#')) {
                fullUrl = buttonUrl;
                removeAndSetActive(buttonUrl);
                button.classList.add('active');
            } else {
                fullUrl = urlVars.siteUrl + buttonUrl;
                window.location.href = fullUrl;  // Redirige a la URL completa
            }
        });
        button.classList.remove('data-url');
    });
}

function removeAndSetActive(buttonUrl) {
    document.querySelectorAll('.active').forEach(e => {
        e.classList.remove('active');
    });
    var section = document.querySelector(buttonUrl);
    section.classList.add('active');
}


htmlOnInit();
// window.stop();
