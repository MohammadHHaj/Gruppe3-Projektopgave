document.addEventListener("DOMContentLoaded", function () {
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
});
const yearsContainer = document.getElementById("years");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

// Generate years from 1990 to 2022 and add to container
for (let year = 1990; year <= 2022; year++) {
  const yearDiv = document.createElement("div");
  yearDiv.innerText = year;
  yearDiv.classList.add("year");
  yearsContainer.appendChild(yearDiv);
}

// Horizontal scroll on drag
let isDragging = false;
let startX, scrollLeft;

yearsContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX - yearsContainer.offsetLeft;
  scrollLeft = yearsContainer.scrollLeft;
});

yearsContainer.addEventListener("mouseleave", () => (isDragging = false));
yearsContainer.addEventListener("mouseup", () => (isDragging = false));
yearsContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - yearsContainer.offsetLeft;
  const walk = (x - startX) * 2; // Scroll speed
  yearsContainer.scrollLeft = scrollLeft - walk;
});

// Arrow buttons to scroll
leftArrow.addEventListener("click", () => (yearsContainer.scrollLeft -= 50));
rightArrow.addEventListener("click", () => (yearsContainer.scrollLeft += 50));
