//document.addEventListener("DOMContentLoaded", function () {
const laget = document.getElementById("forlaget");
const btnclick = [
  document.getElementById("Mobil"),
  document.getElementById("Wifi"),
  document.getElementById("Computer"),
];
//Giver sig selv, linje 1 sørger for at document bliver loadet først, også søger funktionerne efter,
//efter knapperne. Dette er til at undgå at js,en ikke søger efter en knap som ikke var loadet ind.
//Som selfølgelig ville have resulteret i at funktionen ikke ville fungere
btnclick.forEach((button) => {
  if (button) {
    console.log(`Fjerning af forlaget igennem knap fungerede.`);
    button.addEventListener("click", function () {
      laget.classList.add("hidden");

      // Dette under sørger for at diven er helt væk efter transitionen.
      laget.addEventListener("transitionend", function forsvind() {
        //Starter animationen når laget bliver "aktiveret"
        laget.style.display = "none";
        //Gør sådan at diven reelt forsvinder så man kan bruge det der er bagved diven
        laget.removeEventListener("transitionend", forsvind);
        //Stopper animationen
      });
    });
  }
});
const yearInput = document.getElementById("year");
let selectedYear = parseInt(yearInput.value, 10); // Initial selected year

// Update the displayed year and log it
const updateYear = (newYear) => {
  if (newYear >= 1990 && newYear <= 2022) {
    yearInput.value = newYear; // Update the input value
    selectedYear = newYear;
    console.log(newYear); // Log the selected year
  }
};

// Handle keyboard interactions for horizontal scrolling
yearInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    updateYear(selectedYear + 1); // Increment year
    e.preventDefault();
  } else if (e.key === "ArrowLeft") {
    updateYear(selectedYear - 1); // Decrement year
    e.preventDefault();
  }
});

// Handle direct user input (only allow valid years)
yearInput.addEventListener("input", (e) => {
  const newValue = parseInt(e.target.value, 10);
  if (newValue >= 1990 && newValue <= 2022) {
    updateYear(newValue);
  } else {
    e.target.value = selectedYear; // Reset to the last valid value
  }
});
