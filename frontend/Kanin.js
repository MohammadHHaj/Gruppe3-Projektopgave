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
const scrollableDiv = document.getElementById("year-selector");

const yearDiv = document.getElementById("year");
//sætter elementet med id,et year til et objekt "yearDiv"
yearDiv.setAttribute("data-selected-year", "1990");
//Giver yearDiv en attr med "data-selected-year" som bliver brugt til en funktion på script.js
//og attr "1990"
let startx = 0;
for (let year = 1990; year <= 2022; year++) {
  //Deklarer et nyt objekt "year" som 1990 til 2022
  if (year == 1990) {
    const placeholder1 = document.createElement("div");
    placeholder1.className = "year";
    const placeholder2 = document.createElement("div");
    placeholder2.className = "year";
    yearDiv.appendChild(placeholder1);
    yearDiv.appendChild(placeholder2);
  }
  const yearElement = document.createElement("div");
  //Nyt objekt yearElement som bliver skabt under "create" og deklaret som en div
  yearElement.dataset.xvalue = startx;
  startx = startx + 47;
  yearElement.innerText = year;
  //Da vi stadig er i "for" statement så vil den her lave en ny div for hver year som er 1990 til 2022 (32 diver)
  yearElement.className = "year";
  //Giver diven et attr class="year" Den bliver stylet i style.css
  yearElement.dataset.year = year;
  //Giver hver div denne attr data-year="årstallet"
  yearElement.onclick = () => {
    //Når diven med year i bliver trykket på så skal følgende ske

    const x = yearElement.dataset.xvalue;
    console.log(x);
    scrollToPosition(x, 969);

    scrollableDiv.scrollLeft = x;

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
  //siger her hvor yearelementet skal hen og det er som childelement under elementet deklaret i yeardiv.
  if (year == 2022) {
    const placeholder3 = document.createElement("div");
    placeholder3.className = "year";
    const placeholder4 = document.createElement("div");
    placeholder4.className = "year";
    yearDiv.appendChild(placeholder3);
    placeholder4.style.width = "51px";
    yearDiv.appendChild(placeholder4);
  }
}

// Her skal vi finde ud af hvor brugeren har scrollet hen til og finde den nærmeste div.

// Timer til at vide, hvornår brugeren er "stoppet" med at scrolle
let timer = null;
scrollableDiv.addEventListener("scroll", () => {
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    let scrollX = scrollableDiv.scrollLeft;

    // Log hvor timeren er stoppet
    console.log("Timer død ved: " + scrollX);
    //console.log(startx + " " + scrollX);

    // Hent alle positioner på diver, og gem i array "xValues".
    const childDivs = yearDiv.querySelectorAll("div");
    const xValues = [];
    childDivs.forEach((div) => {
      const value = div.getAttribute("data-xvalue");
      if (value !== null) {
        xValues.push(value);
      }
    });

    console.log(xValues);

    //Check hver value i tidligere defineret array for at sammenligne og finde den, der er tættest på.
    let closestValue = null;
    let smallestdifference = Infinity;
    xValues.forEach((index) => {
      const forskel = Math.abs(index - scrollX);
      if (forskel < smallestdifference) {
        smallestdifference = forskel;
        closestValue = index;
      }
    });
    console.log(closestValue);
    //indsæt onclick script.
    // SCRIPTET FRA onClick KAN MERE ELLER MINDRE ANVENDES HER, DIG NED JUSTERINGER - HYG DIG ;)
  }, 200); //milisekunder
  /* 
  let scroll2 = document.getElementById("year");
  console.dir(scrollX);*/
});

function scrollToPosition(targetPosition, duration) {
  const element = document.getElementById("year-selector");
  const startPosition = element.scrollLeft;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    // Ease-in-out function for smoother animation
    const easing =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    // Calculate new scroll position
    element.scrollLeft = startPosition + distance * easing;

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}
