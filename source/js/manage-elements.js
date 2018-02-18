var pageHeader = document.querySelector('.page-header');
var btnOpen = document.querySelector('.main-nav__menu-button-open');
var btnClose = document.querySelector('.main-nav__menu-button-close');
var blMap = document.querySelector('.search-hotels__map');

if (blMap != null) {
  blMap.classList.remove('search-hotels__map--nojs');
}

pageHeader.classList.remove('page-header--nojs');

btnOpen.addEventListener('click', function() {
  if (pageHeader.classList.contains('page-header--closed-menu')) {
    pageHeader.classList.remove('page-header--closed-menu');
  }
});

btnClose.addEventListener('click', function() {
  pageHeader.classList.add('page-header--closed-menu');
});
