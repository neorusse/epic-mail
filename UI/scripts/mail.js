// Variable declaration: Mailbox.
const displayMessage = document.querySelector('#show-message');
const messageTable = document.querySelector('.js-table');
const messageRow = document.querySelectorAll('tr[data-href]');

//Add an event listener to the document on complete load
document.addEventListener('DOMContentLoaded', () => {
  displayMessage.style.display = "none";

  messageRow.forEach(row => {
    row.addEventListener('click', () => {
      window.location.href = row.dataset.href;

      displayMessage.style.display = "block";
      messageTable.style.display = "none";
    });
  });
});

// Mobile View Icon Controller
jQuery(document).ready(function ($) {

  var cols = {};

  messageIsOpen = false;

  cols.showOverlay = function () {
    $('body').addClass('show-main-overlay');
  };
  cols.hideOverlay = function () {
    $('body').removeClass('show-main-overlay');
  };

  cols.showSidebar = function () {
    $('body').addClass('show-sidebar');
  };
  cols.hideSidebar = function () {
    $('body').removeClass('show-sidebar');
  };

  // Show sidebar when trigger is clicked

  $('.js-trigger-toggle-sidebar').on('click', function () {
    cols.showSidebar();
    cols.showOverlay();
  });

  // When you click the overlay, close everything

  $('.main > .overlay').on('click', function () {
    cols.hideOverlay();
    cols.hideSidebar();
  });

});

