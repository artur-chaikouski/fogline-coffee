document.querySelectorAll('[data-section-type="mobile-navigation"]').forEach(function(container){
  WAU.Slideout.init("mobile-navigation");

  if ( !document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger') ) return false;
  document.querySelector('.mobile-nav__mobile-header .js-mini-cart-trigger').addEventListener("click", function() {
    WAU.Slideout._closeByName("mobile-navigation");
  });
});

document.addEventListener("shopify:section:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-navigation"]') ) return false;
  WAU.Slideout._openByName("mobile-navigation");
});

document.addEventListener("shopify:section:deselect", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-navigation"]') ) return false;
  WAU.Slideout._closeByName("mobile-navigation");
});

document.addEventListener("shopify:block:select", function(event) {
  if ( !event.target.querySelector('[data-section-type="mobile-navigation"]') ) return false;
  WAU.Slideout._openByName("mobile-navigation");
});
