<?php

// Register Custom Navigation Walker
require_once get_template_directory() . '/template-parts/navbar.php';

/**
 * Esta funcion permite encolar los links del css y scripts que seran cargados.
 * [Nota] Los links de css por defecto siempre seran cargados en el head y esto permite que sean cargados antes de que sea renderizado el html.
 * Por otro lado los Scrips en el metodo wp_enqueue_script => se le debe añadir **true** al finalizar para que sean cargados en el body antes de renderizar ya que si se le deja **false** o no se declara estos seran añadidos al head.
 * 
 * > Nota: Si desea añadir un archivo js al head debe validar que no dependa de llamados al document html ya que el head carga antes del body y podria genear error.
 *  
 * <code>
 * Encolamiento CSS
 * <?php 
 * wp_enqueue_style('id-unico', direccion_url_del_archivo);
 * get_template_directory_uri() // Metodo que retorna el directorio de la plantilla.
 * // De está forma queda ya concatenada la url.
 * wp_enqueue_style('theme', get_template_directory_uri() . '/assets/css/konex_css/theme.css');
 * ?>
 * Encolamiento Scripts
 * <?php
 * wp_enqueue_script(
 * 'id-unico-js', // Id único
 * direccion_url_del_archivo, // url del archivo
 * array('id-unico-de-dependencia-a-otro-js'), // Un array de dependencias o por defecto vacio
 * '1.0', // Version del script, o null
 * true); // Indica si la carga se hace en el head => false o en el body => true.
 * // Ejemplo:
 * wp_enqueue_script('app-js',get_template_directory_uri() . '/assets/js/app.min.js', array('bootstrap-js'), '1.0', true);
 * ?>
 * </code>
 * > **Nota:** al id-unico por defecto siempre se le añade de forma automatica **-css**, **-js** segun el tipo e encolamiento a utilizar.
 * > - A los encolamientos **wp_enqueue_script** se les debe añadir el **-js** al finalizar el id único.
 * > - Los de tipo **wp_enqueue_style** no hay necesidad.
 * @return void
 */
function enqueue_theme_assets()
{

  // Encolamiento css
  wp_enqueue_style('style', get_stylesheet_uri());
  //Se debe reemplazar por icommon, evita que sea demorado el renderizado en el html.
  wp_enqueue_style('material-symbols', 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
  wp_enqueue_style('theme', get_template_directory_uri() . '/assets/css/konex_css/theme.css');
  wp_enqueue_style('theme', get_template_directory_uri() . '/assets/css/konexIcon/style.css');

  // Encolamiento Js
  wp_enqueue_script('popper', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', array('jquery'), '1.14', true);
  wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js', array('popper'), '4.3', true);
  wp_enqueue_script('html-include-js', get_template_directory_uri() . '/assets/js/html-include.min.js', array(), '1.0', true);
  wp_enqueue_script('app-js', get_template_directory_uri() . '/assets/js/app.min.js', array('bootstrap-js'), '1.0', true);

}

/**
 * Localiza variables de PHP para su uso en scripts JavaScript.
 *
 * Este código obtiene el ID del post actual, el slug del post, y define
 * algunas URLs importantes para localizarlas en un script JavaScript.
 *
 * @return void
 */

function localize_js_variables()
{

  $post_id = get_the_ID(); // Obtener el ID del post actual

  $post_slug = get_post_field('post_name', $post_id); // Obtener el slug (%postname%) del post actual

  $datos_para_js = array(
    'homeUrl' => home_url(),
    'siteUrl' => site_url(),
    'postSlug' => $post_slug,
  );

  wp_localize_script('html-include-js', 'urlVars', $datos_para_js);

}

// Agregar Sidebar
function theme_widgets()
{
  register_sidebar(
    array(
      'id' => 'widgets-derecha',
      'name' => __('Body Widget Derecha'),
      'description' => __('Arrastra lo que quieras'),
      'before_widget' => '<div class="card-body bluu_wi">',
      'after_widget' => '</div>',
      'before_title' => '<h4>',
      'after_title' => '</h4><hr>'
    )
  );
}

// Footer personalizado con widgets
function theme_register_footer_widgets()
{
  register_sidebar(
    array(
      'id' => 'footer-1',
      'name' => __('footer Widgets Area Superior', 'theme_text_domain'),
      'description' => __('Footer personalizado con Widgets y en esta área aparecerán en el primer área del footer.', 'theme_text_domain'),
      'before_widget' => '<div class="footer-widgett">',
      'after_widget' => '</div>',
      'before_title' => '<h3 class="footer-widget-title">',
      'after_title' => '</h3>',
    )
  );

  register_sidebar(
    array(
      'id' => 'footer-2',
      'name' => __('footer Widgets Area Inferior', 'theme_text_domain'),
      'description' => __('Footer personalizado con Widgets y en esta área aparecerán en el segundo área del footer.', 'theme_text_domain'),
      'before_widget' => '<div class="footer-widget">',
      'after_widget' => '</div>',
      'before_title' => '<h3 class="footer-widget-title">',
      'after_title' => '</h3>',
    )
  );
}

/**
 * Metodo dedicado a remover css encolado y que puede afectarnos la visualizacion final en la web.
 * @return void
 */
function remove_global_styles_inline_css()
{
  wp_dequeue_style('global-styles');
  wp_dequeue_style('global-styles-inline-css');
  wp_dequeue_style('wp-block-library'); // Gutenberg block library
  wp_dequeue_style('wp-block-library-theme'); // Gutenberg theme
  wp_dequeue_style('wp-custom-css');
  wp_deregister_style('wp-custom-css');
}

/**
 * Metodo dedicado a remover css encolado y que puede afectarnos la visualizacion final en la web.
 * @return void
 */
function remove_classic_theme_inline_css()
{
  wp_dequeue_style('classic-theme-styles-inline-css');
  wp_dequeue_style('admin-bar-inline-css');
}

/**
 * > **after_setup_theme** => Este hook se utiliza para inicializar configuraciones del tema, como habilitar soporte para características del tema, registrar menús, etc.
 * @return void
 */
function theme_setup()
{

  // Soporte imagenes destacadas
  if (function_exists('add_theme_support')) {
    add_theme_support('post-thumbnails');
  }

  add_theme_support('title-tag');

}

add_action('after_setup_theme', 'theme_setup');

/**
 * > **init** => Este hook se usa para registrar menús, taxonomías, etc. Es un hook temprano en el ciclo de vida de WordPress.
 * @return void
 */
function theme_register_my_menus()
{
  register_nav_menus(
    array(
      'menu-principal' => __('Menú Superior'),
      'menu-inferior' => __('Menú Inferior')
    )
  );
}

add_action('init', 'theme_register_my_menus');

/**
 * > **widgets_init** => Se usa para registrar widgets. Se ejecuta después de init.
 * @return void
 */
function theme_widgets_init()
{
  theme_widgets();
  theme_register_footer_widgets();
}

add_action('widgets_init', 'theme_widgets_init');

/**
 * Funcion dedicada solo a ejecutar lo encolado para scripts.
 * ___
 * > **wp_enqueue_scripts** => Este hook se utiliza para encolar scripts y estilos. Se ejecuta en el momento adecuado para agregar scripts y estilos a la cola de encolado.
 * @return void
 */
function theme_enqueue_scripts()
{
  enqueue_theme_assets();
  localize_js_variables();
  remove_global_styles_inline_css();
}

add_action('wp_enqueue_scripts', 'theme_enqueue_scripts');

/**
 * > **wp_print_styles** => Este hook se ejecuta justo antes de que se impriman los estilos en la cabecera. Se puede usar para eliminar estilos encolados, por ejemplo.
 * @return void
 */
function theme_print_styles()
{
  remove_classic_theme_inline_css();
}

add_action('wp_print_styles', 'remove_classic_theme_inline_css', 100);

/**
 * Uso de buffering de salida para asegurarse de que el shortcode se procese primero y no se vea ralentizada la carga de la web.
 * ___
 * > **get_header** => Este hook se ejecuta justo antes de cargar la cabecera del tema. Es útil para procesar shortcodes antes de que se envíe la salida de la cabecera.
 * @return void
 */
function process_shortcodes_before_output()
{
  ob_start(); // Iniciar el buffering de salida
}

add_action('get_header', 'process_shortcodes_before_output');

/**
 * Metodo encargado de procesar los shorcodes:
 * 1. Obtener el contenido del buffer de salida
 * 2. Limpiar el buffer de salida
 * 3. Procesar los shortcodes en el contenido
 * ___
 * > **wp_footer** => Este hook se ejecuta justo antes del cierre de la etiqueta </body>. Es útil para encolar scripts que deben ejecutarse al final de la página.
 * @return void
 */
function flush_shortcodes_before_output()
{
  $contenido = ob_get_contents(); // Obtener el contenido del buffer de salida  
  ob_end_clean(); // Limpiar el buffer de salida  
  echo do_shortcode($contenido); // Procesar los shortcodes en el contenido
}

add_action('wp_footer', 'flush_shortcodes_before_output');

/**
 * Metodo que permite carga de contenido html en las páginas de wordpress utilizando un shortcode
 * 
 * **Shortcode a utilizar solo en las páginas de wordpress:**
 * ___
 *  > **[cargar_html archivo="assets/html/home.html"]**
 * ___
 * > **Nota:** Los archivos a cargar debes estar dentro del tema.Para este caso se encuentran en **assets** para mejor organizacion de archivos en el directorio.
 * ___
 * > **add_shortcode** => se usa para registrar shortcodes. Puede ser registrado en cualquier momento antes de que se procesen los shortcodes.
 * 
 * @param mixed $atts
 * @return bool|string
 */
function load_html_external($atts)
{
  // Extraer el atributo 'archivo' del shortcode
  $archivo = $atts['archivo'];
  // Construir la ruta completa del archivo
  $ruta_completa = get_template_directory_uri() . '/' . $archivo;

  // Obtener el contenido del archivo
  $contenido = @file_get_contents($ruta_completa);

  // Verificar si se pudo obtener el contenido
  if ($contenido === FALSE) {
    return 'Archivo no encontrado.';
  }

  return $contenido;
}

add_shortcode('cargar_html', 'load_html_external');
