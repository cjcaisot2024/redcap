<footer>
	<div class="footer-content-box"
		data-html-include="components/footer">
		<?php if (is_active_sidebar('footer-1') || is_customize_preview()): ?>
			<?php dynamic_sidebar('footer-1'); ?>
		<?php endif; ?>

		<?php if (is_active_sidebar('footer-2') || is_customize_preview()): ?>
			<?php dynamic_sidebar('footer-2'); ?>
		<?php endif; ?>
		<!-- Puedes añadir más áreas de widgets según sea necesario -->
	</div>
</footer>

<!-- Optional JavaScript -->
<?php wp_footer(); ?>

<?php
wp_nav_menu(
	array(
		'theme_location' => 'menu-inferior',
		'depth' => 1,
		'container' => 'div',
		'container_class' => 'footer-menu-container',
		'menu_class' => 'footer-menu',
		'fallback_cb' => false
	)
);
?>
</div>
</div>
</body>

</html>