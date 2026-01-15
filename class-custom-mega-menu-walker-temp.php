<?php
/**
 * Custom Mega Menu Walker for WordPress
 * 
 * Extends Walker_Nav_Menu to create custom dropdown menus with mega menu support
 * 
 * Usage in your theme:
 * wp_nav_menu( array(
 *     'theme_location' => 'primary',
 *     'menu_id'        => 'menu-main',
 *     'menu_class'     => 'navigation__menu menu',
 *     'walker'         => new Custom_Mega_Menu_Walker()
 * ) );
 */

class Custom_Mega_Menu_Walker extends Walker_Nav_Menu {

	/**
	 * Starts the list before the elements are added.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param int      $depth  Depth of menu item. Used for padding.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = str_repeat( $t, $depth );

		// Check if this is a mega menu (depth 0) or regular submenu (depth 1+)
		if ( $depth === 0 ) {
			// Check if parent has 'mega-menu' class
			// We'll handle this in start_el by checking classes
			$output .= "{$n}{$indent}<div class=\"mega-sub-menu\">{$n}";
			$output .= "{$indent}{$t}<div class=\"mega-sub-menu__wrapper\">{$n}";
		} else {
			// Regular submenu
			$classes = array( 'sub-menu' );
			$class_names = implode( ' ', apply_filters( 'nav_menu_submenu_css_class', $classes, $args, $depth ) );
			$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
			$output .= "{$n}{$indent}<ul$class_names>{$n}";
		}
	}

	/**
	 * Ends the list of after the elements are added.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param int      $depth  Depth of menu item. Used for padding.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 */
	public function end_lvl( &$output, $depth = 0, $args = null ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = str_repeat( $t, $depth );

		if ( $depth === 0 ) {
			// Close mega menu structure
			$output .= "{$indent}{$t}</div>{$n}"; // Close mega-sub-menu__wrapper
			
			// Add mega menu header section (you can customize this per menu item)
			$output .= $this->get_mega_menu_header( $indent, $t );
			
			$output .= "{$indent}</div>{$n}"; // Close mega-sub-menu
		} else {
			$output .= "{$indent}</ul>{$n}";
		}
	}

	/**
	 * Starts the element output.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param WP_Post  $item   Menu item data object.
	 * @param int      $depth  Depth of menu item. Used for padding.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 * @param int      $id     Current item ID.
	 */
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}
		$indent = ( $depth ) ? str_repeat( $t, $depth ) : '';

		$classes   = empty( $item->classes ) ? array() : (array) $item->classes;
		$classes[] = 'menu-item-' . $item->ID;
		$classes[] = 'menu__item';

		// Check if this item has children
		$has_children = in_array( 'menu-item-has-children', $classes );

		// Apply filters
		$class_names = implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args, $depth ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';

		// ID
		$id = apply_filters( 'nav_menu_item_id', 'menu-item-' . $item->ID, $item, $args, $depth );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';

		// Check if we're in a mega menu column
		$is_mega_column = ( $depth === 1 && $this->is_mega_menu_item( $item ) );

		if ( $is_mega_column ) {
			// Output as a column in mega menu
			$output .= $indent . '<div class="mega-sub-menu__col mega-sub-menu__col--1">' . $n;
			$output .= $indent . $t . '<div class="mega-sub-menu__title">' . esc_html( $item->title ) . '</div>' . $n;
			$output .= $indent . $t . '<ul class="mega-sub-menu__list">' . $n;
		} else {
			// Regular menu item
			$output .= $indent . '<li' . $id . $class_names . '>';

			// Link attributes
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

			// Add custom classes to links
			$atts['class'] = 'menu__link no_animation_line';

			// Check if this is a Resources-style dropdown item
			$is_dropdown_block = ( $depth === 1 && $this->has_dropdown_block_class( $item ) );

			$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

			$attributes = '';
			foreach ( $atts as $attr => $value ) {
				if ( is_scalar( $value ) && '' !== $value && false !== $value ) {
					$value       = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
					$attributes .= ' ' . $attr . '="' . $value . '"';
				}
			}

			// Build link content
			$title = apply_filters( 'the_title', $item->title, $item->ID );
			$title = apply_filters( 'nav_menu_item_title', $title, $item, $args, $depth );

			if ( $is_dropdown_block ) {
				// Resources-style dropdown with description
				$item_output  = $args->before;
				$item_output .= '<a' . $attributes . ' class="no_animation_line">';
				$item_output .= $n . $indent . $t . $t . '<div class="dropdown__block">' . $n;
				$item_output .= $indent . $t . $t . $t . '<div class="dropdown__title">' . $title . '</div>' . $n;
				
				// You can add description from menu item description field
				if ( ! empty( $item->description ) ) {
					$item_output .= $indent . $t . $t . $t . '<div class="dropdown__description">' . esc_html( $item->description ) . '</div>' . $n;
				}
				
				$item_output .= $indent . $t . $t . $t . '<div class="dropdown__more">Continue &gt;</div>' . $n;
				$item_output .= $indent . $t . $t . '</div>' . $n . $indent . $t;
				$item_output .= '</a>';
				$item_output .= $args->after;
			} else {
				// Regular link
				$item_output  = $args->before;
				$item_output .= '<a' . $attributes . '>';
				$item_output .= $args->link_before . $title . $args->link_after;
				$item_output .= '</a>';
				$item_output .= $args->after;
			}

			$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
		}
	}

	/**
	 * Ends the element output, if needed.
	 *
	 * @param string   $output Used to append additional content (passed by reference).
	 * @param WP_Post  $item   Page data object. Not used.
	 * @param int      $depth  Depth of page. Not Used.
	 * @param stdClass $args   An object of wp_nav_menu() arguments.
	 */
	public function end_el( &$output, $item, $depth = 0, $args = null ) {
		if ( isset( $args->item_spacing ) && 'discard' === $args->item_spacing ) {
			$t = '';
			$n = '';
		} else {
			$t = "\t";
			$n = "\n";
		}

		$is_mega_column = ( $depth === 1 && $this->is_mega_menu_item( $item ) );

		if ( $is_mega_column ) {
			$output .= str_repeat( $t, $depth + 1 ) . '</ul>' . $n;
			$output .= str_repeat( $t, $depth ) . '</div>' . $n; // Close mega-sub-menu__col
		} else {
			$output .= "</li>{$n}";
		}
	}

	/**
	 * Check if menu item should be rendered as mega menu column
	 *
	 * @param WP_Post $item Menu item data object.
	 * @return bool
	 */
	private function is_mega_menu_item( $item ) {
		// Check if item has 'menu-features_container' class or similar
		$classes = (array) $item->classes;
		return in_array( 'menu-features_container', $classes ) || 
		       in_array( 'mega-menu-column', $classes );
	}

	/**
	 * Check if menu item should have dropdown block styling
	 *
	 * @param WP_Post $item Menu item data object.
	 * @return bool
	 */
	private function has_dropdown_block_class( $item ) {
		$classes = (array) $item->classes;
		return in_array( 'dropdown-block', $classes );
	}

	/**
	 * Generate mega menu header section
	 *
	 * @param string $indent Indentation string
	 * @param string $t Tab character
	 * @return string HTML for mega menu header
	 */
	private function get_mega_menu_header( $indent, $t ) {
		// This is a placeholder - customize per menu or add via WordPress customizer
		// You can make this dynamic by checking menu item meta or using a filter
		
		$header = '';
		$header .= $indent . $t . '<header class="mega-sub-menu__header">' . "\n";
		$header .= $indent . $t . $t . '<div class="mega-sub-menu__title">4 Ways to create dynamic content:</div>' . "\n";
		$header .= $indent . $t . $t . '<div class="header__wrap">' . "\n";
		
		// Add header items (these should ideally come from theme options or a custom field)
		$header_items = apply_filters( 'custom_mega_menu_header_items', array() );
		
		if ( ! empty( $header_items ) ) {
			foreach ( $header_items as $header_item ) {
				$header .= $indent . $t . $t . $t . '<a href="' . esc_url( $header_item['url'] ) . '" class="header__item no_animation_line">' . "\n";
				$header .= $indent . $t . $t . $t . $t . '<div class="item__image">' . "\n";
				$header .= $indent . $t . $t . $t . $t . $t . '<img class="no-popup" src="' . esc_url( $header_item['image'] ) . '" alt="">' . "\n";
				$header .= $indent . $t . $t . $t . $t . '</div>' . "\n";
				$header .= $indent . $t . $t . $t . $t . '<div class="item__content">' . "\n";
				$header .= $indent . $t . $t . $t . $t . $t . '<div class="item__title">' . esc_html( $header_item['title'] ) . '</div>' . "\n";
				$header .= $indent . $t . $t . $t . $t . $t . '<div class="item__text">' . esc_html( $header_item['text'] ) . '</div>' . "\n";
				$header .= $indent . $t . $t . $t . $t . '</div>' . "\n";
				$header .= $indent . $t . $t . $t . '</a>' . "\n";
			}
		}
		
		$header .= $indent . $t . $t . '</div>' . "\n";
		$header .= $indent . $t . '</header>' . "\n";
		
		return $header;
	}
}

