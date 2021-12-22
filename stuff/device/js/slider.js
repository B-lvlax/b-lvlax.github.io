'use strict';

const servicesTabs = document.querySelectorAll('.js-tab');
const servicesContent = document.querySelectorAll('.js-tabContent');

function removeActiveState(elems) {
  elems.forEach(function(el) {
    el.classList.remove('active');
  });
}

servicesTabs.forEach(function(el, i) {
  el.addEventListener('click', function(e) {
    e.preventDefault();

    if (!this.classList.contains('active')) {
      removeActiveState(servicesTabs);
      removeActiveState(servicesContent);

      this.classList.add('active');
      servicesContent[i].classList.add('active');
    }
  });
});