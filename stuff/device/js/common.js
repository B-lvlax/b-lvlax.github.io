'use strict';


/* NAV SubMenu
===================================================================== */
const navSubLinks = document.querySelectorAll('.js-subLink');
const navSubList = document.querySelector('.js-subList');

navSubLinks.forEach(function(el) {
  el.addEventListener('focus', function() {
    navSubList.classList.add('active');
  });
  el.addEventListener('blur', function() {
    navSubList.classList.remove('active');
  });
});


/* MODALS
===================================================================== */
const modals = document.querySelector('.js-modals');

function showModals(modal) {
  const btnClose = modal.querySelector('.js-btnClose');

  btnClose.addEventListener('click', function(e) {
    e.preventDefault();
    hideModals(modal);
  });
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modals')) {
      hideModals(modal);
    }
  });
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 27 && modals.classList.contains('active') && modal.classList.contains('active')) {
      hideModals(modal);
    }
  });

  modals.classList.add('active');
  modal.classList.add('active');
}

function hideModals(modal) {
  modals.classList.remove('active');
  modal.classList.remove('active');
}

/* MAP
------------------------------------ */
const btnMap = document.querySelectorAll('.js-btnMap');
const map = document.querySelector('.js-map');

btnMap.forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    showModals(map);
  });
});