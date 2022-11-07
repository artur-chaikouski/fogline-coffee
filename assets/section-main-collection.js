const CollectionFilters = {
	init: function init(container, sectionId) {
		if ( container.querySelector("[data-filters-hz]") || container.querySelector("[data-collection-sort-by]") ) {
			this.horizontalFilters();
			this.currentFilters();
		}
		this.updateCollectionMsg(container);
		if ( container.querySelector("[data-filters-price-range]") ) {
			this.priceRange();
			this.priceSlider();
		}
		if ( container.querySelector("[data-collection-tag-group]") ) {
			this.tagGroupFilter();
		}
		if ( container.querySelector("[data-mobile-filters]") ) {
			this.mobileFilters();
		}
		this.filterData = [];
	},
	horizontalFilters: function horizontalFilters() {
		const listFilters = document.querySelectorAll('.js-hz-filter');
		listFilters.forEach((item, i) => {
			const inputField = item.querySelector('.js-hz-filter-input');
			const dropdown = item.querySelector('.js-hz-filter-list');
			const dropdownArray = [... item.querySelectorAll('li')];

			let valueArray = [];

			dropdownArray.forEach(item => {
				let searchLabel = item.querySelector('.js-hz-filter-label');
				if ( !searchLabel ) return false;
				valueArray.push(searchLabel.textContent);
			});

			const closeDropdown = () => {
				dropdown.classList.remove('open');
			}

			inputField.addEventListener('input', () => {
				dropdown.classList.add('open');
				let inputValue = inputField.value.toLowerCase();
				let valueSubstring;
				if (inputValue.length > 0) {
					for (let j = 0; j < valueArray.length; j++) {
						if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
							dropdownArray[j].classList.add('closed');
						} else {
							dropdownArray[j].classList.remove('closed');
						}
					}
				} else {
					for (let i = 0; i < dropdownArray.length; i++) {
						dropdownArray[i].classList.remove('closed');
					}
				}
			});

			dropdownArray.forEach(item => {
				item.addEventListener('click', (evt) => {

					if ( item.querySelector('input[type="checkbox"]').checked ) {
						item.classList.remove('current');
						item.querySelector('input[type="checkbox"]').checked = false;
					} else {
						item.classList.add('current');
						item.querySelector('input[type="checkbox"]').checked = true;
					}

					if ( item.getAttribute('data-placeholder') ) {
						inputField.placeholder = item.dataset.placeholder;
					}

					const formData = new FormData(inputField.closest('form'));
			    const searchParams = new URLSearchParams(formData).toString();
					const accordionContext = item.closest('.c-accordion__panel');

			    CollectionFilters.renderPage(searchParams, accordionContext, true);

					dropdownArray.forEach(dropdown => {
						dropdown.classList.add('closed');
					});
				});
			})

			inputField.addEventListener('focus', () => {
				 inputField.placeholder = inputField.dataset.genericPlaceholder;
				 inputField.classList.add('active');
				 dropdown.classList.add('open');
				 dropdownArray.forEach(dropdown => {
					 dropdown.classList.remove('closed');
				 });
			});

			inputField.addEventListener('blur', () => {
				inputField.placeholder = inputField.dataset.placeholder;
				inputField.classList.remove('active');
				dropdown.classList.remove('open');
			});

			document.addEventListener('click', (evt) => {
				const isDropdown = dropdown.contains(evt.target);
				const isInput = inputField.contains(evt.target);
				if (!isDropdown && !isInput) {
					dropdown.classList.remove('open');
				}
			});
		});
	},
	priceRange: function priceRange() {
		// Add filter to urlParm after text input changes
		const filters = document.querySelectorAll('.js-filter-range-input');
		if (filters.length > 0) {
			filters.forEach((item, i) => {
				item.addEventListener('change', function(event){
					setTimeout(function() {
						const formData = new FormData(item.closest('form'));
						const searchParams = new URLSearchParams(formData).toString();
						const accordionContext = item.closest('.c-accordion__panel');

						CollectionFilters.renderPage(searchParams, accordionContext, true);

					}, 1000);
				});
			});
		}

		// Open/close horizontal price range filter
		const filterButtons = document.querySelectorAll('.js-hz-filter-price-trigger');

		filterButtons.forEach((item, i) => {
			// Show or hide dropdown when clicking
			document.addEventListener('click', function(event){
				const dropdown = item.nextElementSibling;
				const isTrigger = event.target.classList.contains('js-hz-filter-price-trigger');
				const isDropdown = dropdown.contains(event.target);

				// Prevent default on button
				if (isTrigger) {
					event.preventDefault();
				}

				// Hide dropdown on off click
				if (!isDropdown && !isTrigger) {
					item.classList.remove('active');
					dropdown.style.display = 'none';
				}

				// Only show dropdown if clicked Trigger
				if (!isTrigger) return false;

				if (dropdown.style.display == 'inline-block') {
					item.classList.remove('active');
					dropdown.style.display = 'none';
				} else {
					item.classList.add('active');
					dropdown.style.display = 'inline-block';
				}

			});

			// Show dropdown when tabbing on
			let mouseDown = false;

			item.addEventListener('mousedown', () => {
				mouseDown = true;
			});

			item.addEventListener('mouseup', () => {
				mouseDown = false;
			});

			item.addEventListener('focus', (event) => {
				if (!mouseDown) {
					const dropdown = event.target.nextElementSibling;
					item.classList.add('active');
					dropdown.style.display = 'inline-block';
				}
			});

			// Hide dropdown when tabbing off
			document.addEventListener('keyup', (event) => {
				if (event.keyCode == 9) {
					const dropdown = document.querySelector('.js-hz-filter-price-dropdown');

					if (!document.querySelector('.js-hz-filter-price').contains(event.target)) {
						item.classList.remove('active');
						dropdown.style.display = 'none';
					}
				}
			});
		});
	},
	priceSlider: function priceSlider() {
    var parents = document.querySelectorAll(".js-price-range");

    if ( !parents ) return false;

    parents.forEach((parent, i) => {
      var rangeS = parent.querySelectorAll("input[type=range]"),
          numberS = parent.querySelectorAll("input[type=number]");

      rangeS.forEach(function(el) {
        el.oninput = function() {
          var slide1 = parseFloat(rangeS[0].value),
              slide2 = parseFloat(rangeS[1].value);

          var slide1Dec = (Math.round(slide1 * 100) / 100),
							slide2Dec = (Math.round(slide2 * 100) / 100);

          if (parseFloat(slide1Dec) > parseFloat(slide2Dec)) { [slide1Dec, slide2Dec] = [slide2Dec, slide1Dec] }

          numberS[0].value = slide1Dec;
          numberS[1].value = slide2Dec;
        }
      });

      rangeS[0].onchange = function() {
        numberS[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      rangeS[1].onchange = function() {
        numberS[1].dispatchEvent(new Event('change', { bubbles: true }));
      }

      numberS.forEach(function(el) {
        el.oninput = function() {
          var number1 = parseFloat(numberS[0].value),
              number2 = parseFloat(numberS[1].value);

          var number1Dec = (Math.round(number1 * 100) / 100),
              number2Dec = (Math.round(number2 * 100) / 100);

          if (number1Dec > number2Dec) {
            var tmp = number1Dec;
            numberS[0].value = number2Dec;
            numberS[1].value = tmp;
          }

          rangeS[0].value = number1Dec;
          rangeS[1].value = number2Dec;

        }
      });
    });
  },
	tagGroupFilter: function tagGroupFilter() {
		var tagGroup = document.querySelectorAll('.js-collection-tag-group'),
				currentTagGroups = [];

		tagGroup.forEach(function(element, i) {
			if (!checkTags(element.dataset.type)) {
				element.style.display = "none";
			} else {
				currentTagGroups.push(element);
			}
		});

		if (currentTagGroups.length === 0) {
			if (document.querySelector('.js-collection-filter-title')){
				document.querySelector('.js-collection-filter-title').style.display = "none";
			}
		}

		currentTagGroups.forEach((item, i) => {
			if (i == 0) {
				updateSelected(item);
				updateTags(item.dataset.type);
			}

			if (currentTagGroups.length === 1) return false;

			item.addEventListener("click", function(event) {
				event.preventDefault();

				updateSelected(event.target);
				updateTags(event.target.dataset.type);
			});
		});

		function checkTags(group) {
			var tags = document.querySelectorAll('.js-collection-tag');
			var currentTags = [];

			tags.forEach((item, i) => {
				if (item.dataset.type == group) {
					currentTags.push(item.dataset.type)
				}
			});

			return currentTags.length > 0;
		}
		function updateTags(group) {
			var tags = document.querySelectorAll('.js-collection-tag');

			tags.forEach((item, i) => {
				if (item.dataset.type == group) {
					item.style.display = 'inline-block'
				} else {
					item.style.display = 'none';
				}
			});
		}
		function updateSelected(element) {
			document.querySelectorAll('.js-collection-tag-group').forEach((item, i) => {
				item.classList.remove("selected");
			});

			element.classList.add("selected");
		}
	},
	currentFilters: function currentFilters() {
		const filters = document.querySelectorAll('.js-current-filter');

		filters.forEach((item, i) => {
			item.addEventListener('click', (event) => {
				event.preventDefault();
				CollectionFilters.onActiveFilterClick(event);
			});
		});
	},
	mobileFilters: function mobileFilters(context) {
		const filters = document.querySelectorAll('.js-collection-mob-filter');

		filters.forEach((item, i) => {
			item.addEventListener('click', (event) => {
				event.preventDefault();

				if ( item.querySelector('input[type="checkbox"]').checked ) {
					item.classList.remove('current');
					item.querySelector('input[type="checkbox"]').checked = false;
				} else {
					item.classList.add('current');
					item.querySelector('input[type="checkbox"]').checked = true;
				}

				const formData = new FormData(item.closest('form'));
				const searchParams = new URLSearchParams(formData).toString();
				const accordionContext = item.closest('.c-accordion__panel');

				CollectionFilters.renderPage(searchParams, accordionContext, true);
			});
		});
	},
	openAccordions: function openAccordions(trigger) {
		const accordionContext = trigger.getAttribute('data-accordion-context');
		const slideout = document.getElementById('CollectionMobileFiltersForm');
		const selectAccordions = slideout.querySelectorAll('.js-accordion-header[data-accordion-context="' + accordionContext + '"]');

		selectAccordions.forEach((item, i) => {
			const target = item.querySelector('[data-toggle="accordion"]');
			WAU.Accordion.show(target, true);
		});
	},
	renderFilters: function renderFilters(accordionContext, sidebarOpen) {
		var container = document.querySelector('[data-section-type="collection"]');

		if ( document.querySelector("[data-mobile-filters]") ) {
			WAU.Slideout.init("collection-filters");
			this.mobileFilters();

			if ( sidebarOpen && window.matchMedia('(max-width: 767px)').matches) {
        WAU.Slideout._openByName("collection-filters");
        if ( accordionContext != null ) this.openAccordions(accordionContext);
      }
		}
		if ( document.querySelector("[data-filters-hz]") || document.querySelector("[data-collection-sort-by]") ) {
			this.horizontalFilters();
			this.currentFilters();
		}
		this.updateCollectionMsg(container);
		if ( document.querySelector("[data-filters-price-range]") ) {
			this.priceRange();
			this.priceSlider();
		}
		if ( document.querySelector("[data-collection-tag-group]") ) {
			this.tagGroupFilter();
		}
		if ( document.querySelector("[data-collection-sort-by]") ) {
			if ( document.querySelector("[data-collection-sort-by]").querySelector('.current') ) {
				const placeholder = document.querySelector("[data-collection-sort-by]").querySelector('.current').dataset.placeholder;
				document.querySelector("[data-collection-sort-by]").querySelector('.js-hz-filter-input').placeholder = placeholder;
			}
		}

		WAU.Quickshop.init();
		WAU.ProductGridVideo.init();
		WAU.Helpers.lazyLoad('.lazy', true);
	},
	renderSectionFromFetch: function renderSectionFromFetch(url, section, accordionContext, sidebarOpen) {
		fetch(url)
			.then(response => response.text())
			.then((responseText) => {
				const html = responseText;
				this.filterData = [...this.filterData, { html, url }];
				this.renderProductGrid(html);
				this.renderFilters(accordionContext, sidebarOpen);
			});
	},
	renderSectionFromCache: function renderSectionFromCache(filterDataUrl, section, accordionContext, sidebarOpen) {
		const html = this.filterData.find(filterDataUrl).html;
		this.renderProductGrid(html);
		this.renderFilters(accordionContext, sidebarOpen);
	},
	renderPage: function renderPage(searchParams, accordionContext, sidebarOpen, updateURLHash = true) {
		const sections = this.getSections();

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section, accordionContext, sidebarOpen) :
        this.renderSectionFromFetch(url, section, accordionContext, sidebarOpen);
    });

    if (updateURLHash) this.updateURLHash(searchParams);
	},
	renderProductGrid: function renderProductGrid(html) {
		const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
	},
	updateCollectionMsg: function updateCollectionMsg(container) {
		var empty = container.getAttribute('data-empty'),
				filterMsg = container.querySelector('.js-coll-empty-filter'),
				regMsg = container.querySelector('.js-coll-empty');

		if ( !filterMsg || !regMsg ) return false;

		if ( empty === 'true' ) {
			filterMsg.style.display = 'none';
			regMsg.style.display = 'block';
		} else {
			filterMsg.style.display = 'block';
			regMsg.style.display = 'none';
		}
	},
	onActiveFilterClick: function onActiveFilterClick(event) {
		event.preventDefault();
		this.renderPage(new URL(event.currentTarget.href).searchParams.toString());
	},
	updateURLHash: function updateURLHash(searchParams) {
		history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
	},
	getSections: function getSections() {
    return [
      {
        id: 'main-collection-product-grid',
        section: document.getElementById('main-collection-product-grid').dataset.id,
      }
    ]
  }
}

document.querySelectorAll('[data-section-type="collection"]').forEach(function(container){
  WAU.Slideout.init("collection-filters");
  if ( container.querySelector("[data-filters]") ) {
    CollectionFilters.init(container, container.dataset.sectionId);
  }
});

document.addEventListener("shopify:section:load", function(event) {
  if (event.target.querySelector('[data-section-type="collection"]')) {
		var container = event.target.querySelector('[data-section-type="collection"]');
		WAU.Slideout.init("collection-filters");
	  if ( container.querySelector("[data-filters]") ) {
	    CollectionFilters.init(container, container.dataset.sectionId);
	  }
  }
});
