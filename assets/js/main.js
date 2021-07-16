/*
	Retrospect by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel
		.breakpoints({
			xlarge: '(max-width: 1680px)',
			large: '(max-width: 1280px)',
			medium: '(max-width: 980px)',
			small: '(max-width: 736px)',
			xsmall: '(max-width: 480px)'
		});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			// $body.addClass('is-loading');

			$(window).load(function() {
				$body.removeClass('is-loading');
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Nav.
			$('#nav')
				.append('<a href="#nav" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

		// TOC.
			$('#toc')
				.append('<a href="#toc" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

	});

})(jQuery);
// Header Transition modified
var initiallyAlt = 0;
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
		if (document.getElementById("header").classList.contains("alt")) {
			document.getElementById("header").classList.remove("alt");
			initiallyAlt = 1;
		}
	} else {
		if (initiallyAlt) {
			document.getElementById("header").classList.add("alt");
		}
	}
}

window.onload = function() {
	lastScrollTop = window.pageYOffset;
}// global variable lastScrollTop
var initiallyAlt = 0;
window.addEventListener("scroll", function(){
	var st = window.pageYOffset;
	var mediaQuery = window.matchMedia("(max-width: 736px)")
	if (mediaQuery.matches) {
		if (st > lastScrollTop){
			document.getElementById("nav").classList.add("squeezed");
		} else {
			document.getElementById("nav").classList.remove("squeezed");
		}
	} else {
		document.getElementById("header").classList.remove("squeezed");
	}
	lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);