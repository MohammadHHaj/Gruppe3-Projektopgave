document.addEventListener("DOMContentLoaded", function () {
  const fakta = document.getElementById("faktabox");
  const laget = document.getElementById("forlaget");
  const laget1 = document.getElementById("blurryforlag");
  const laget2 = document.getElementById("kategoriforlag");
  const btnclick = [
    document.getElementById("forlagmobil"),
    document.getElementById("forlaginternet"),
    document.getElementById("forlagelektricitet"),
  ];

  btnclick.forEach((button) => {
    if (button) {
      button.addEventListener("click", function () {
        fakta.classList.remove("hidden");
        laget.classList.add("hidden");
        laget1.classList.add("hidden");

        // Slide down the kategoriforlag div
        if (laget2) {
          laget2.style.height = "0"; // Collapses the height
          laget2.addEventListener("transitionend", function forsvind() {
            laget2.style.display = "none"; // Fully hides after transition
            laget2.removeEventListener("transitionend", forsvind);
          });
        }
      });
    }
  });
});

const scrollableDiv = document.getElementById("year-selector");
//laver scrollableDiv til elementet der har en id year-selector
const yearDiv = document.getElementById("year");
//sætter elementet med id,et year til et objekt "yearDiv"
yearDiv.setAttribute("data-selected-year", "1990");
//Giver yearDiv en attr med "data-selected-year" som bliver brugt til en funktion på script.js
//og attr "1990"
let startx = 0;
//laver en ny værdi som er start værdien (altså når du starter på hjemmesiden)
for (let year = 1990; year <= 2022; year++) {
  //Deklarer et nyt objekt "year" som 1990 til 2022
  if (year == 1990) {
    yearDiv.getAttribute("data-selected-year");
    const placeholder1 = document.createElement("div");
    placeholder1.className = "year";
    const placeholder2 = document.createElement("div");
    placeholder2.className = "year";
    yearDiv.appendChild(placeholder1);
    yearDiv.appendChild(placeholder2);
    //Da 1990 skal kunne være i midten så skal 1990 have to diver til venstre for sig, for at skabe noget empty space
    //Derfor if year er 1990 lav to div med class year. De skal stadig have class year
  }
  const yearElement = document.createElement("div");
  //Nyt objekt yearElement som bliver skabt under "create" og deklaret som en div
  yearElement.dataset.xvalue = startx;
  //Dette ligger en attri i alle elementerne som hedder 0til(plads0) 47til(plads1) 94til(plads2) osv så den skal pluds med 47 hvergang (Se linjen under.)
  startx = startx + 47;
  //Ligger startx som 47. det bliver brugt til bredten af hver div i px.
  //Det bruges til at samligne med senere.
  yearElement.innerText = year;
  //Da vi stadig er i "for" statement så vil den her lave en ny div for hver year som er 1990 til 2022 (32 diver)
  yearElement.className = "year";
  //Giver diven et attr class="year" Den bliver stylet i style.css
  yearElement.dataset.year = year;
  //Giver hver div denne attr data-year="årstallet"
  yearElement.onclick = () => {
    //Når diven med et year i bliver trykket på så skal følgende ske

    const x = yearElement.dataset.xvalue;
    //Laver en ny const til det samme men denne gang uden allerede indførte værdier.
    //Så at x altid vil være det sidste som brugeren har trykket på
    //console.log("Det aktiveret år er " + x + " px henne i scrollablediven"); evt ide
    //Så x er den der er trykket på
    scrollToPosition(x, 969);
    //Den skal få x til at scrollToPosition som er den position som er defineret som midten (se længere nede)
    //969 er milisekunderne som den skal bruge på at scroll
    scrollableDiv.scrollLeft = x;
    //ScrollLeft får den til at scroll i scrollablediv til det ønsket punkt (linje72)
    yearDiv.setAttribute("data-selected-year", year);
    //Den skal vælge det år der bliver trykket på,s data-year="årstallet"
    document
      .querySelectorAll(".year")
      .forEach((el) => el.classList.remove("selected"));
    //Den skal første fjerne class selected for hver div der ikke blev trykket på når én bliver trykket på.
    yearElement.classList.add("selected");
    //tilføjer selected class til den div der er trykket på og dermed gør den grå
    console.log(
      "Der blev trykket på år " +
        yearDiv.getAttribute("data-selected-year") +
        " og det er " +
        x +
        " pixels henne i scrollablediven."
    );
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
    //hvis året er ligemed 2022 så lav 2 tomme diver efter
    //style width skal være på 51px på placeholder4 da css,en bare ikke passede med midten ellers.
  }
}
if (yearDiv.getAttribute("data-selected-year")) {
  const firstYearElement = yearDiv.querySelector('[data-year="1990"]');
  if (firstYearElement) {
    firstYearElement.classList.add("selected");
    yearDiv.setAttribute("data-selected-year", "1990");
  }
}

// Her skal vi finde ud af hvor brugeren har scrollet hen til og finde den nærmeste div.

// Timer til at vide, hvornår brugeren er "stoppet" med at scrolle
let timer = null;
let ignorescrolling = false;
//laver en variabel der hedder timer som er timeren som starter på null
scrollableDiv.addEventListener("scroll", () => {
  //skal lytte efter scroll i scrollablediv
  if (ignorescrolling) return;
  if (timer !== null) {
    //hvis timer ikke er ligemed null
    //Dvs så længe timeren er igang skal den gøre følgende
    clearTimeout(timer);
    //Nulstiller timeren
  }

  timer = setTimeout(function () {
    //laver en funktion til timeren
    let scrollX = scrollableDiv.scrollLeft;
    //bruges til at gemme hver meget der er scrollet i diven som scrollX
    // Log ved hvilken px timeren er stoppet
    //Console logger for at se om det er rigtigt, at den ved hvornår man stopper

    const childDivs = yearDiv.querySelectorAll("div");
    //henter alle diver i yeardiv
    const xValues = [];
    //laver en const med et array hvor der ikke er noget defineret i
    childDivs.forEach((div) => {
      //for hver childDivs i yeardiv gør følgende
      const value = div.getAttribute("data-xvalue");
      //Lav en konstant som er value (value er divens px tal)
      if (value !== null) {
        //hvis værdien ikke er null skal den gøre følgende
        xValues.push(value);
        //sætter alle divers px tal i et array under xvalues
      }
    });
    // Henter alle positioner på diver, og gem i array "xValues".

    //console.log(xValues); //Bruges til at logge hele arrayet hvis der sker fejl

    //Check hver value i tidligere defineret array for at sammenligne og finde den, der er tættest på.
    let closestValue = null;
    //
    let smallestdifference = Infinity;
    xValues.forEach((index) => {
      const forskel = Math.abs(index - scrollX);
      if (forskel < smallestdifference) {
        smallestdifference = forskel;
        closestValue = index;
      }
    });
    console.log(
      "Det år der var tættest på dit scroll var " +
        closestValue +
        " henne i scrollablediv. Derfor blev år " +
        yearDiv.getAttribute("data-selected-year") +
        " valgt."
    );
    const closestYearElement = document.querySelector(
      `[data-xvalue="${closestValue}"]`
    );

    if (closestYearElement) {
      const year = closestYearElement.getAttribute("data-year");
      // Smooth scroll to the closest year position
      scrollToPosition(closestValue, 500);
      // Update the selected year in the yearDiv
      yearDiv.setAttribute("data-selected-year", year);

      // Remove the 'selected' class from all year elements
      document
        .querySelectorAll(".year")
        .forEach((el) => el.classList.remove("selected"));

      // Add 'selected' class to the closest year element
      closestYearElement.classList.add("selected");

      // Ensure it smoothly transitions into view
      scrollableDiv.scrollLeft = closestValue;

      // Logically simulate the behavior of the onclick function
      yearDiv.setAttribute("data-selected-year", year);

      // Apply all effects from onclick
      closestYearElement.classList.add("selected");
    }
  }, 200); //milisekunder
});
//Herunder er funktionen til at den selv kan finde den div der er tættest på.
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
    } else {
      ignorescrolling = false;
    }
  }

  ignorescrolling = true;

  requestAnimationFrame(animateScroll);
}
//scroll top-menu kode
const OversigtKnap = document.getElementById("OversigtKnap");
const Sektion1 = document.getElementById("sektion1");
OversigtKnap.addEventListener("click", () => {
  Sektion1.scrollIntoView({ behavior: "smooth" });
});
const WorldMapKnap = document.getElementById("WorldMapKnap");
const Sektion2 = document.getElementById("sektion2");
WorldMapKnap.addEventListener("click", () => {
  Sektion2.scrollIntoView({ behavior: "smooth" });
});
const GrafKnap = document.getElementById("GrafKnap");
const Sektion3 = document.getElementById("sektion3");
GrafKnap.addEventListener("click", () => {
  Sektion3.scrollIntoView({ behavior: "smooth" });
});
const OmOsKnap = document.getElementById("OmOsKnap");
const Sektion4 = document.getElementById("sektion4");
OmOsKnap.addEventListener("click", () => {
  Sektion4.scrollIntoView({ behavior: "smooth" });
});
