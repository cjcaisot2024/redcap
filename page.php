<?php get_header(); ?>

<div class="container content-body">
      <!-- aqui va el contenido o entradas -->
      <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
        <?php the_content(); ?>
      <?php endwhile; endif; ?>
</div>
      
<?php get_footer(); ?>