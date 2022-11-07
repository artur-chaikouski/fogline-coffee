const MasonrySection = (function() {
  const Constructor = function(selector, options) {
    let publicAPIs = {};
    const defaults = {
      selectors: {
        grid: '.js-masonry-grid',
        carousel: ".js-carousel",
        flktyPrevBtn: ".flickity-prev-next-button.previous",
        flktyPrevSvg: ".flickity-prev-next-button.previous svg",
        flktyNextBtn: ".flickity-prev-next-button.next",
        flktyNextSvg: ".flickity-prev-next-button.next svg",
        themePrevSvg: ".js-masonry-carousel-prev",
        themeNextSvg: ".js-masonry-carousel-next",
        noFoucClass: "no-fouc"
      },
      masonryGrid: {
        mediaQuery: "(max-width: 1024px)",
        enabled: true,
        options: {
          itemSelector: ".grid-item",
          columnWidth: ".grid-sizer",
          percentPosition: true,
          gutter: ".gutter-sizer"
        }
      },
    };
    let settings;
    let msnry;
    let grid;
    const getGrid = function() {
      return grid;
    }
    const setGrid = function(node) {
      grid = node;
    }
    const handleOrientationChange = (event) => {
      let elem = getGrid();
      if (typeof msnry === 'object') {
        msnry.destroy();
      }
      const options = {
        itemSelector: settings.masonryGrid.options.itemSelector,
        columnWidth: settings.masonryGrid.options.columnWidth,
        percentPosition: settings.masonryGrid.options.percentPosition,
        gutter: settings.masonryGrid.options.gutter
      };
      if (!event.matches) {
        options.horizontalOrder = true;
      }

      var imgLoad = imagesLoaded( elem );
      function onAlways() {
        const msnry = new Masonry(elem, options);
        msnry.reloadItems();
        msnry.layout();
      }
      if (elem) {
        imgLoad.on( 'always', onAlways )
      }

    };
    const setUpEventHandlers = (container, instance) => {
      if (setCarouselPreviousButton(container, instance, settings.selectors.themePrevSvg) && setCarouselNextButton(container, instance, settings.selectors.themeNextSvg)) {
        return true;
      } else {
        return false;
      }
    };
    const setCarouselPreviousButton = (container, instance, selector) => {
      if (!instance || !selector) {
        console.log('Error. must provide a selector.');
        return false;
      }
      container.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', event => {
          instance.previous(true);
        });
      });
      return true;
    };
    const setCarouselNextButton = (container, instance, selector) => {
      if (!instance || !selector) {
        console.log('Error. must provide a selector.');
        return false;
      }
      container.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', event => {
          instance.next(true);
        })
      });
      return true;
    };
    const setCarousel = (node) => {
      carousel = node;
    };
    const getCarousel = () => {
      return carousel;
    };
    publicAPIs.removeNoFoucClass = (container) => {
      if (!container) {
        console.log('Error. Must provide a container element to remove the class from');
        return false;
      }
      if (container.classList.contains('no-fouc')) {
        container.classList.remove('no-fouc')
      }
    }
    publicAPIs.initCarousel = container => {
      if (!container) {
        console.log('Error. Must provide a container element to initialize carousel');
        return false;
      }
      publicAPIs.removeNoFoucClass(container);
      const carousel = container.querySelector(settings.selectors.carousel);
      let flkty = new Flickity(carousel, {
        wrapAround: true,
        contain: true,
        pageDots: false,
        autoPlay: false,
        prevNextButtons: true,
        selectedAttraction: 0.01,
        dragThreshold: 5,
        adaptiveHeight: false,
        imagesLoaded: true
      });
      setUpEventHandlers(container, flkty);
      setCarousel(flkty);
    };
    publicAPIs.init = (container, options) => {
      if (!container) {
        console.log('Error. Must provide a container to initialize the Masonry Gallery section');
        return false;
      }

      settings = Object.assign({}, defaults, options);

      publicAPIs.initCarousel(container);

      let grid = container.querySelector(settings.selectors.grid);
      setGrid(grid);

      const mediaQueryList = window.matchMedia(settings.masonryGrid.mediaQuery);
      handleOrientationChange(mediaQueryList);
      mediaQueryList.addListener(handleOrientationChange);
    }

    publicAPIs.init(selector, options);

  // Editor Events

    document.addEventListener("shopify:section:load", function(event) {
      if (event.target.querySelector('[data-section-type="masonry-gallery"]')) {
        var container = event.target.querySelector('[data-section-type="masonry-gallery"]');
        const loader = new WAU.Helpers.scriptLoader();
        loader.load([jsAssets.flickity]).finally(() => {
          loader.load([container.dataset.vendorAssetUrl]).finally(() => {
            const MyMasonrySection = new MasonrySection(container);
            publicAPIs.init(selector, options);
          });
        });
      }
    });

    return publicAPIs;
  };
  return Constructor;
})();

const scrollBlockIntoView = (element) => {
  if (!element) {
    console.log('Error. Must provide an element to scroll to.');
    return false;
  }
  setTimeout(() => {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 500)
};

document.querySelectorAll('[data-section-type="masonry-gallery"]').forEach(function(container){
  const loader = new WAU.Helpers.scriptLoader();
  loader.load([jsAssets.flickity]).finally(() => {
    loader.load([container.dataset.vendorAssetUrl]).finally(() => {
      const MyMasonrySection = new MasonrySection(container);
    });
  });
});

document.addEventListener("shopify:block:select", function(event) {
  if (event.target.querySelector('[data-section-type="masonry-gallery"]')) {
    var container = event.target.querySelector('[data-section-type="masonry-gallery"]');
    scrollBlockIntoView(event.target);
  }
});
