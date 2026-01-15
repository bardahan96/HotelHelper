<?php
/**
 * Dropdown Block Walker
 */

if ( ! class_exists( 'Walker_Nav_Menu' ) ) {
	return;
}

class Dropdown_Block_Walker extends Walker_Nav_Menu {

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';

		$classes   = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;

		$class_names = implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		$output .= $indent . '<li' . $id . $class_names . '>';

		$atts           = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		if ( '_blank' === $item->target && empty( $item->xfn ) ) {
			$atts['rel'] = 'noopener';
		} else {
			$atts['rel'] = $item->xfn;
		}
		$atts['href']         = ! empty( $item->url ) ? $item->url : '';
		$atts['aria-current'] = $item->current ? 'page' : '';

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
				$value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		$title = apply_filters( 'the_title', $item->title, $item->ID );
		$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

		$is_dropdown_block = ( $item->menu_item_parent == 5228202 ) || in_array( 'dropdown-block', (array) $item->classes );

		$item_output = isset( $args->before ) ? $args->before : '';

		if ( $is_dropdown_block ) {
			$item_output .= '<a' . $attributes . '>';
			$item_output .= "\n\t\t\t\t<div class=\"dropdown__block\">";
			$item_output .= "\n\t\t\t\t\t<div class=\"dropdown__title\">" . $title . "</div>";
			
			if ( ! empty( $item->description ) ) {
				$item_output .= "\n\t\t\t\t\t<div class=\"dropdown__description\">" . esc_html( $item->description ) . "</div>";
			}
			
			$item_output .= "\n\t\t\t\t\t<div class=\"dropdown__more\">";
			$item_output .= "\n\t\t\t\t\t\tContinue &gt;";
			$item_output .= "\n\t\t\t\t\t</div>";
			$item_output .= "\n\t\t\t\t</div>";
			$item_output .= "\n\t\t\t</a>";
		} else {
			$item_output .= '<a' . $attributes . '>';
			$link_before = isset( $args->link_before ) ? $args->link_before : '';
			$link_after = isset( $args->link_after ) ? $args->link_after : '';
			$item_output .= $link_before . $title . $link_after;
			$item_output .= '</a>';
		}

		$item_output .= isset( $args->after ) ? $args->after : '';

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
}
