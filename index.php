<?php get_header(); ?>

      <div class="row">
        <!-- Entradas -->
        <div class="col-lg-9">
          
          

          <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
            <!-- Entrada -->
          <div class="card-body">
            <a href="<?php the_permalink(); ?>">
              <h2><?php the_title(); ?></h2>
            </a>
           

            <?php
              if ( has_post_thumbnail() ) {
                  the_post_thumbnail('post-thumbnails', array(
                    'class' => 'img-fluid mb-3'
                  ));
              }
            ?>

            <!-- <img src="img/1200.jpg" alt="" class="img-fluid mb-3" /> -->
            <?php the_excerpt(); ?>
            <a href="<?php the_permalink(); ?>" class="btn btn-primary">Más info...</a>
          </div>
          <!-- Entrada -->
          <?php endwhile; endif; ?>

          <!-- Paginación -->
          <div class="card-body">
            <?php get_template_part('template-parts/content', 'paginacion'); ?>
          </div>
          <!-- Paginación -->

        </div>
        <!-- Entradas -->

        <!-- Aside -->
        <?php get_sidebar(); ?>
        <!-- Aside -->
      </div>
    </div>
    <!-- blog -->


    <?php get_footer(); ?>
