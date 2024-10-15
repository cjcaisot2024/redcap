<!DOCTYPE html>
<html <?php language_attributes(); ?>>

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <meta property="og:title" content="Konex Innovation" />
  <meta property="og:description" content="Innovando el Futuro a tu medida.
Soluciones tecnológicas que marcan la diferencia." />
  <meta property="og:image"
    content="<?php echo esc_url(WP_CONTENT_URL . '/themes/theme_konex_web/assets/uploads/images/konex.png'); ?>" />
  <meta property="og:url" content="<?php echo get_template_directory_uri() ?>" />
  <meta property="og:type" content="Konex" />
  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <div class="content-wrapper">
    <div class="wrapper">
      <!-- Menú -->
      <header id="headerContent">
        <nav class="header-content-box navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="header-content container">
            <div class="block-header-left">
              <a class="navbar-brand" href="<?php echo esc_url(home_url('/')); ?>">
                <div class="logo2 data-img" data-file-name="logo-header.svg"></div>
                <div class="logo1 data-img" data-file-name="logo-header-white.svg"></div>
              </a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <em class="icon_menu"></em>
              </button>
            </div>


            <?php
            wp_nav_menu(
              array(
                'theme_location' => 'menu-principal',
                'depth' => 2,
                'container' => 'div',
                'container_class' => 'block-header-right collapse navbar-collapse',
                'container_id' => 'navbarSupportedContent',
                'menu_class' => 'header-list nav navbar-nav ml-auto',
                'fallback_cb' => 'WP_Bootstrap_Navwalker::fallback',
                'walker' => new WP_Bootstrap_Navwalker(),
              )
            );
            ?>
          </div>          
        </nav>
      </header>
      <!-- menú -->