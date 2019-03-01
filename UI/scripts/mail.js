// DOM elements selection
let displayInbox = document.querySelector('.inbox');
let displaySentBox = document.querySelector('.sent-box');
let displayDraftBox = document.querySelector('.draft-box');
let displayDeleteBox = document.querySelector('.delete-box');


// Display Inbox Messages
const showInbox = () => {
  displayInbox.style.display = 'block';
  displaySentBox.style.display = 'none';
  displayDraftBox.style.display = 'none';
  displayDeleteBox.style.display = 'none';
};

// Display Sent Messages
const showSentBox = () => {
  displaySentBox.style.display = 'block';
  displayInbox.style.display = 'none';
  displayDraftBox.style.display = 'none';
  displayDeleteBox.style.display = 'none';
}

// Display Draft Messages
const showDraftBox = () => {
  displayDraftBox.style.display = 'block';
  displaySentBox.style.display = 'none';
  displayInbox.style.display = 'none';
  displayDeleteBox.style.display = 'none';
}

// Display Deleted Messages
const showDeleteBox = () => {
  displayDeleteBox.style.display = 'block';
  displaySentBox.style.display = 'none';
  displayInbox.style.display = 'none';
  displayDraftBox.style.display = 'none';
}


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

