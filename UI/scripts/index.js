// IIFE for navBar control
const navBar = (() => {
  // select DOM element and assign to variable
  let mainNav = document.querySelector('.js-main-nav');
  let navBarToggle = document.querySelector('.js-navbar__toggle');

  // listen for click event
  navBarToggle.addEventListener('click', function () {
    mainNav.classList.toggle('active');
  });
})();

// IIFE to inject year dynamically
const date = (() => {
  // select DOM element and assign to variable
  let year = document.querySelector('.js-date');
  year.innerHTML = new Date().getFullYear();
})();
