const dropdown = document.querySelector(".dropdown");
const dropdownButton = dropdown.querySelector("button");
const dropdownContent = dropdown.querySelector(".dropdown-content");

let timeout;

function toggleDropdown() {
  const rect = dropdownButton.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Tjek om der er plads til hele dropdown-menuen under knappen
  if (rect.bottom + dropdownContent.offsetHeight > viewportHeight) {
    // Hvis der ikke er plads under, åbner menuen over
    dropdownContent.style.top = `-${dropdownContent.offsetHeight + 10}px`;
  } else {
    // Hvis der er plads under knappen, åbner menuen under
    dropdownContent.style.top = `${rect.height + 10}px`;
  }

  dropdownContent.style.display = "block";
}

function hideDropdown() {
  dropdownContent.style.display = "none";
}

// Åbner dropdown, når man hover over knappen
dropdownButton.addEventListener("mouseenter", function () {
  clearTimeout(timeout);
  toggleDropdown();
});

// Holder dropdown åben, når man hover over menuen
dropdownContent.addEventListener("mouseenter", function () {
  clearTimeout(timeout);
  dropdownContent.style.display = "block"; // holder menuen åben
});

// Lukker dropdown, når man ikke hover over knappen eller menuen
dropdownButton.addEventListener("mouseleave", function () {
  timeout = setTimeout(function () {
    if (!dropdownContent.matches(":hover")) {
      hideDropdown();
    }
  }, 200); // Lukker menuen efter 200ms, hvis ikke musen er over den
});

dropdownContent.addEventListener("mouseleave", function () {
  timeout = setTimeout(function () {
    if (!dropdownButton.matches(":hover")) {
      hideDropdown();
    }
  }, 200);
});

// Opdaterer dropdown position ved scroll
window.addEventListener("scroll", function () {
  const rect = dropdownButton.getBoundingClientRect();
  const viewportHeight = window.innerHeight;

  // Hvis dropdown-menuen er åben, tjek om der er plads under knappen
  if (dropdownContent.style.display === "block") {
    if (rect.bottom + dropdownContent.offsetHeight > viewportHeight) {
      // Hvis der ikke er plads under, åbner menuen over
      dropdownContent.style.top = `-${dropdownContent.offsetHeight + 10}px`;
    } else {
      // Hvis der er plads under, åbner menuen under
      dropdownContent.style.top = `${rect.height + 10}px`;
    }
  }
});
