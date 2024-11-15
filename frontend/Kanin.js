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
const yearDiv = document.getElementById("year");
//sætter elementet med id,et year til et objekt "yearDiv"
yearDiv.setAttribute("data-selected-year", "1990");
//Giver yearDiv en attr med "data-selected-year" som bliver brugt til en funktion på script.js
//og attr "1990"
for (let year = 1990; year <= 2022; year++) {
  //Deklarer et nyt objekt "year" som 1990 til 2022
  const yearElement = document.createElement("div");
  //Nyt objekt yearElement som bliver skabt under "create" og deklaret som en div
  yearElement.innerText = year;
  //Da vi stadig er i "for" statement så vil den her lave en ny div for hver year som er 1990 til 2022 (32 diver)
  yearElement.className = "year";
  //Giver diven et attr class="year" Den bliver stylet i style.css
  yearElement.dataset.year = year;
  //Giver hver div denne attr data-year="årstallet"
  yearElement.onclick = () => {
    //Når diven med year i bliver trykket på så skal følgende ske
    yearDiv.setAttribute("data-selected-year", year);
    //Den skal vælge det år der bliver trykket på,s data-year="årstallet"
    document
      .querySelectorAll(".year")
      .forEach((el) => el.classList.remove("selected"));
    //Den skal første fjerne class selected for hver div der ikke blev trykket på når én bliver trykket på.
    yearElement.classList.add("selected");
    //tilføjer selected class til den div der er trykket på og dermed gør den grå
    console.log(yearDiv.getAttribute("data-selected-year"));
    //Logger det valgte år så det er nemmere at fejlfinde hvis/når der opstår fejl.
  };

  yearDiv.appendChild(yearElement);
}
//siger her hvor yearelementet skal hen og det er som childelement under elementet deklaret i yeardiv.
