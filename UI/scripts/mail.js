// Variable declaration: Mailbox.
const displayMessage = document.querySelector('#show-message');
const messageTable = document.querySelector('.js-table');
const messageRow = document.querySelectorAll('tr[data-href]');

//Add an event listener to the document on complete load
document.addEventListener('DOMContentLoaded', () => {
  // Displays email message for reading
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
const showOverlay = () => {
  document.body.classList.add('show-main-overlay')
}

const hideOverlay = () => {
  document.body.classList.remove('show-main-overlay')
}

const showSidebar = () => {
  document.body.classList.add('show-sidebar')
}

const hideSidebar = () => {
  document.body.classList.remove('show-sidebar')
}

// Show sidebar when hamburger icon is clicked
let showSidebarBtn = document.querySelector('.js-trigger-toggle-sidebar');

showSidebarBtn.addEventListener('click', () => {
  showSidebar();
  showOverlay();
});

// Hide sidebar when hamburger icon is clicked
let hideSidebarBtn = document.querySelector('.main > .overlay');

hideSidebarBtn.addEventListener('click', () => {
  hideSidebar();
  hideOverlay();
});



