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
const yearDiv = document.getElementById("year");

// Set an initial selected year as a custom property
yearDiv.setAttribute("data-selected-year", "1990");

// Populate years inside the "year" div
for (let year = 1990; year <= 2022; year++) {
  const yearElement = document.createElement("div");
  yearElement.innerText = year;
  yearElement.className = "year";
  yearElement.dataset.year = year;

  // Add click handler to set the selected year and highlight
  yearElement.onclick = () => {
    yearDiv.setAttribute("data-selected-year", year); // Update custom property
    document
      .querySelectorAll(".year")
      .forEach((el) => el.classList.remove("selected")); // Remove highlight
    yearElement.classList.add("selected"); // Add highlight to clicked year
    console.log(yearDiv.getAttribute("data-selected-year")); // Log the selected year
  };

  yearDiv.appendChild(yearElement);
}
