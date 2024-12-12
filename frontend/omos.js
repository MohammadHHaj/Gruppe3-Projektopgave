const dropdown = document.querySelector(".dropdown");
const dropdownButton = dropdown.querySelector("button");
const dropdownContent = dropdown.querySelector(".dropdown-content");

function toggleDropdown() {
  const rect = dropdownButton.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Tjek om der er plads til hele dropdown-menuen under knappen
  if (rect.bottom + dropdownContent.offsetHeight > viewportHeight) {
    dropdownContent.style.top = `-${dropdownContent.offsetHeight + 10}px`;
  } else {
    dropdownContent.style.top = `${rect.height + 10}px`;
  }

  dropdownContent.classList.add("visible"); // Gør dropdown synlig
}

function hideDropdown() {
  dropdownContent.classList.remove("visible"); // Skjul dropdown
}

// Funktion for at opdatere dropdownens position dynamisk
function updateDropdownPosition() {
  const rect = dropdownButton.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  if (rect.bottom + dropdownContent.offsetHeight > viewportHeight) {
    dropdownContent.style.top = `-${dropdownContent.offsetHeight + 10}px`;
  } else {
    dropdownContent.style.top = `${rect.height + 10}px`;
  }
}

// Åbner dropdown, når man hover over knappen
dropdownButton.addEventListener("mouseenter", function () {
  toggleDropdown();
});

// Holder dropdown åben, når man hover over menuen
dropdownContent.addEventListener("mouseenter", function () {
  dropdownContent.classList.add("visible");
});

// Lukker dropdown, når musen forlader knappen
dropdownButton.addEventListener("mouseleave", function () {
  if (!dropdownContent.matches(":hover")) {
    hideDropdown();
  }
});

// Lukker dropdown, når musen forlader menuen
dropdownContent.addEventListener("mouseleave", function () {
  if (!dropdownButton.matches(":hover")) {
    hideDropdown();
  }
});

// Overvåg position ved visning
dropdownButton.addEventListener("mouseenter", updateDropdownPosition);
