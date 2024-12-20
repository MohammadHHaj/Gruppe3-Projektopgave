document.addEventListener("DOMContentLoaded", function () {
  const fakta = document.getElementById("faktabox");
  const cirkler = document.getElementById("buttons");
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
        cirkler.classList.remove("hidden");
        laget.classList.add("hidden");
        laget1.classList.add("hidden");
        setTimeout(() => (laget.style.display = "none"), 300);
        setTimeout(() => (laget1.style.display = "none"), 300);

        // Slide down the kategoriforlag div med timer
        if (laget2) {
          laget2.style.height = "0"; // Den højde som laget2 skal blive til
          laget2.addEventListener("transitionend", function forsvind() {
            laget2.style.display = "none"; // Display none gør også at man kan bruge elementerne bag ved
            laget2.removeEventListener("transitionend", forsvind);
          });
        }
      });
    }
  });
});

/*Year-wheel */
/*Year-wheel */
/*Year-wheel */
/*Year-wheel */
const scrollableDiv = document.getElementById("year-selector");
// Finder det scrollbare element med id'et 'year-selector'.
const yearDiv = document.getElementById("year");
// Finder elementet med id'et 'year', som indeholder årstallene.
yearDiv.setAttribute("data-selected-year", "1990");
// Sætter 1990 som standardværdi i year-wheelet. Dvs første gang du åbner siden så er det, det den er på.

let startx = 0;
// Start positionen for årstallene/diverne hvor årstallene ligger i.
for (let year = 1990; year <= 2022; year++) {
  // for-Loop, der opretter årstalselementer fra 1990 til 2022.
  if (year == 1990) {
    yearDiv.getAttribute("data-selected-year");
    const placeholder1 = document.createElement("div");
    placeholder1.className = "year";
    const placeholder2 = document.createElement("div");
    placeholder2.className = "year";
    yearDiv.appendChild(placeholder1);
    yearDiv.appendChild(placeholder2);
  }
  //Laver to tomme diver for starten af arrayet. Dette gør at 1990 kan være i midten
  const yearElement = document.createElement("div");
  // Opretter en ny div til hvert år.
  yearElement.dataset.xvalue = startx;
  // sætter startx som valgte år
  startx = startx + 47;
  // Opdaterer x-positionen for det næste element.
  yearElement.innerText = year;
  // Indsætter årstallet som tekst i diverne
  yearElement.className = "year";
  // Giver diverne klassen "year".
  yearElement.dataset.year = year;
  // Tilføjer en data-attribut med årstallet. (data-year="1990")

  yearElement.onclick = () => {
    // Følgende skal ske når der bliver trykket på et yearelement som er en af de diver som årende står i.
    const x = yearElement.dataset.xvalue;
    // Positionen for det klikkede element.
    scrollToPosition(x, 200);
    // Ruller til x-positionen på 200 ms. 200 er hvor hurtigt den skal scrolle over til position x i milisekunder.
    // scrollToPosition er en func der bliver lavet længere nede
    scrollableDiv.scrollLeft = x;
    // Sætter x til til
    yearDiv.setAttribute("data-selected-year", year);
    // Sætter det valgte år som data-selected year.
    //Det er den her attr som mappet søger efter (se starten af script)
    document
      .querySelectorAll(".year")
      .forEach((el) => el.classList.remove("selected"));
    // Fjerner klassen "selected" fra alle år. (den tager alle i tilfælde fejl, så )
    yearElement.classList.add("selected");
    // Efter den har fjernet alle skal den sætte selected på den som er valgt (yearElement)
    console.log("Året:", year, "Bliver vist nu, igennem et tryk.");
  };

  yearDiv.appendChild(yearElement);
  // Tilføjer det nye årstalselement til yearDiv.
  if (year == 2022) {
    // Hvis året er 2022, tilføj to tomme pladsholdere efter.
    const placeholder3 = document.createElement("div");
    placeholder3.className = "year";
    const placeholder4 = document.createElement("div");
    placeholder4.className = "year";
    yearDiv.appendChild(placeholder3);
    placeholder4.style.width = "51px";
    // Justerer bredden på den sidste pladsholder for centreringsformål.
    yearDiv.appendChild(placeholder4);
  }
  //Laver to tomme diver igen efter 2022. Så 2022 kan være under pilen.
}

if (yearDiv.getAttribute("data-selected-year")) {
  // Hvis der er defineret et valgt år, marker 1990 som standard.
  const firstYearElement = yearDiv.querySelector('[data-year="1990"]');
  if (firstYearElement) {
    firstYearElement.classList.add("selected");
    // Tilføjer klassen "selected" til 1990.
    yearDiv.setAttribute("data-selected-year", "1990");
    // Indstiller 1990 som det valgte år.
  }
} //slutning af for-loopet

let timer = null;
// Laver et varibalt object der hedder timer med en værdi på null.
let ignorescrolling = false;
// En flag-variabel, der forhindrer gentagne scroll-hændelser.

const childDivs = Array.from(yearDiv.querySelectorAll("div"));
//kalder alle diverne med år i for childDivs. I ét samlet array
const xValues = childDivs
  // Starter med at definere en konstant, der skal indeholde den filtrerede liste.
  .map((div) => parseInt(div.getAttribute("data-xvalue")))
  // For hver "div" i "childDivs" udfører den map-funktionen:
  // - Henter værdien af "data-xvalue"-attributten for det enkelte element.
  // - Konverterer den hentede værdi fra en streng til et heltal ved hjælp af parseInt.
  .filter((value) => !isNaN(value));
// Filtrerer resultatet af map:
// - Tjekker om værdien ikke er NaN (dvs. at det er et gyldigt tal).
// - Kun værdier, der er tal, bevares i den endelige liste.

let isProgrammaticScroll = false;
// Flag for programmatisk scrolling

scrollableDiv.addEventListener("scroll", () => {
  // Lyt efter scroll-events på scrollableDiv.
  if (ignorescrolling || isProgrammaticScroll) return;
  // Hvis ignorescrolling eller programmatisk scrolling er aktivt, afbryd håndtering.
  //Dette er så den ikke forveksler scrolltoposition med et scroll, og dermed kører denne kommando to gange.

  if (timer !== null) {
    clearTimeout(timer);
    // Hvis timer ikke er lige med null så skal den nulstil timeren
  }

  timer = setTimeout(function () {
    // functionen herunder starter når brugeren stopper med at scrolle
    let scrollX = scrollableDiv.scrollLeft;
    // Finder ud af hvor meget scroll der er scrollet i diven fra venstre side og kalder det tal for scrollX

    let closestValue = null;
    let smallestdifference = Infinity;
    xValues.forEach((index) => {
      // Gennemgå hver xValue for at finde den, der er tættest på scrollX.
      const forskel = Math.abs(index - scrollX);
      if (forskel < smallestdifference) {
        smallestdifference = forskel;
        closestValue = index;
        // den tætteste xvalue bliver fundet. Xvalue er de forskellige værdi der er i et array. de værdier er de forskellige divers længde af scroll i hele scrollablediven.
        //Dette bliver brugt som et id (plads)
      }
    });

    const closestYearElement = document.querySelector(
      `[data-xvalue="${closestValue}"]`
    );
    // Find det element, der matcher den nærmeste xValue.

    if (closestYearElement) {
      const year = closestYearElement.getAttribute("data-year");
      // Hent årstallet for det nærmeste element.

      document
        .querySelectorAll(".year")
        .forEach((el) => el.classList.remove("selected"));
      // Fjern 'selected' fra alle år.
      closestYearElement.classList.add("selected");
      // Tilføj 'selected' til det nærmeste år.

      isProgrammaticScroll = true;
      scrollToPosition(closestValue, 200);
      // Scroll til den nærmeste x-position med en smooth animation.
      // 200 er milisekunder som er hvor lang tid den skal bruge for at scrollToPosition.
      yearDiv.setAttribute("data-selected-year", year);
      // Opdater attributten 'data-selected-year' med det nye valgte år.

      scrollableDiv.scrollLeft = closestValue;
      // Sæt scroll-positionen direkte til den nærmeste værdi.

      setTimeout(() => {
        // Nulstil både ignorescrolling og programmatisk scrolling efter en kort tid
        ignorescrolling = false;
        isProgrammaticScroll = false;
        // Tillad normale scroll-events igen.
      }, 300);
      // Skal være lidt længere end varigheden af scrollToPosition. Så at den ikke ender med at fange et scrollToPosition som et scroll.

      console.log("Året:", year, "Bliver vist nu, igennem et scroll.");
      // Log det valgte år til konsollen.
    }
  }, 200); // Ventetid i millisekunder før timeout-funktionen aktiveres.
}); //slutning af eventlistener

function scrollToPosition(targetPosition, duration) {
  // Funktion til at scrolle til en årets position i løbet af tidsrummet (duration)
  const element = document.getElementById("year-selector");
  const startPosition = element.scrollLeft;
  //sætter startposition til den mængde der kan scrolles fra elementet(diven) og til venstrekant.
  const distance = targetPosition - startPosition;
  //laver distance til targetposition - startposition.
  //Så distance er den distance der skal scrolles for at man ender med diven i under pilen.
  const startTime = performance.now();
  //StartTime sadt til performance.now(); som holder øje med hvornår func starer.
  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    // sætter elapased til at beregne hvor lang tid der er gået siden animationen begyndte.
    // Beregner hvor meget tid der er gået siden scroll-start.
    const progress = Math.min(elapsedTime / duration, 1);
    // Beregner progress fra 0 til 1.

    // Beregner easing for animationen baseret på progress (hvor langt animationen er nået).
    function easeIn(progress) {
      return 2 * progress * progress;
      // "Ease-in": Animationen starter langsomt og accelererer mod midten.
    }
    function easeOut(progress) {
      return -1 + (4 - 2 * progress) * progress;
      // "Ease-out": Animationen begynder at bremse ned i den sidste halvdel.
    }
    const easing = progress < 0.5 ? easeIn(progress) : easeOut(progress);
    // Hvis progress er mindre end 0.5 (første halvdel), bruges easeIn.
    // Hvis progress er 0.5 eller mere (anden halvdel), bruges easeOut.

    element.scrollLeft = startPosition + distance * easing;
    // Opdaterer scroll-positionen baseret på easing og progress.

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
      // Fortsætter animationen, hvis den ikke er færdig.
    } else {
      ignorescrolling = false;
      // Tillader scroll igen, når animationen er færdig.
    }
  }

  ignorescrolling = true;
  // Forhindrer scroll-detektion under animationen. Ved første at erklerer den true her.

  requestAnimationFrame(animateScroll);
  // Starter animationen.
}
/*Year-wheel */
/*Year-wheel */
/*Year-wheel */
/*Year-wheel */
/*Year-wheel */
let typed = new Typed("#autoskrivning", {
  strings: [
    "Velkommen til vores side",
    "Hvad ved du egentlig om Wifi, Internet, og Mobilers udvikling igennem tiden?",
  ],
  typeSpeed: 15,
  startDelay: 700,
  backDelay: 1000,
  backSpeed: 20,
  showCursor: false,
});
//Ny func herunder
const texts = {
  PopMobil:
    "<span class='popbox'>Siden 1990’erne har der været fart på mobilens udvikling. Både vægten og prisen styrtdykkede, og i 1995 var der flere end én million mobiltelefonejere på verdensplan. Så altså stadig forsvindende få i forhold til i dag. I 2004 overhalede antallet af mobilabonnenter antallet af fastnetabonnenter, og i dag bruger 97 procent af danskerne en mobiltelefon eller smartphone. <b class='UmutsFar'> Tryk på mobiltelefoner for at læse mere. </b> </span>",
  PopInternet:
    "<span class='popbox'>Et internet er betegnelsen for et netværk af computernetværk, som er koblet sammen. Ofte taler man om internettet, der så betegner et globalt netværk af datanet-værter (computere). Internettet er en af de vigtigste opfindelser fra det 20. århundrede. Ikke fordi det i sig selv er noget teknisk vidunder, men på grund af de store konsekvenser det allerede har for vores måde at leve vores liv på. <b class='UmutsFar'> Tryk på internet for at læse mere.</b></span>",
  PopEl:
    "<span class='popbox'>Danmark blev i 1997 for første gang i nyere tid selvforsynende med energi. En stigende produktion fra olie- og gasfelterne i Nordsøen sammenholdt med et stagnerende forbrug betød, at selvforsyningsgraden voksede til 155 % i 2004 mod 52 % i 1990 og 5% i 1980. Siden er produktionen af både olie og gas faldet, så selvforsyningsgraden i 2021 var 55 %. <b class='UmutsFar'> Tryk på elektricitet for at læse mere. </b></span>",
};

// Store the original content
const brodtekstElement = document.getElementById("WoodBird");
const originalContent = brodtekstElement.innerHTML;

// Add event listeners for hover
document.querySelectorAll(".bold").forEach((span) => {
  span.addEventListener("mouseover", () => {
    brodtekstElement.innerHTML = `<p>${texts[span.id]}</p>`;
  });

  span.addEventListener("mouseout", () => {
    brodtekstElement.innerHTML = originalContent;
  });
});
//Ny func herunder
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll("#topBarKnapper .radio .name");

function getOffsetTop(element) {
  let offsetTop = 0;
  while (element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const offset =
    sectionId === "sektion1"
      ? 100
      : sectionId === "sektion4"
      ? -10
      : window.innerWidth < 1300
      ? -10
      : 100;

  const targetTop = getOffsetTop(section) - offset;
  const scrollDuration = 500;
  const startPosition = window.scrollY;
  const distance = targetTop - startPosition;
  const startTime = performance.now();

  function animation(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / scrollDuration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  requestAnimationFrame(animation);
}

function updateActiveLink() {
  const offset = 100;
  let currentSection = null;

  sections.forEach((section) => {
    const sectionTop = getOffsetTop(section) - offset;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive =
      link.getAttribute("onclick", "scroll")?.includes(currentSection) || false;

    if (!isActive) {
      link.classList.remove("active");
      link.style.color = "rgba(51, 65, 85, 1)";
      link.style.fontWeight = "normal";
      link.style.backgroundColor = "transparent";
      link.style.boxShadow = "none";
    } else {
      link.classList.add("active");
      link.style.color = "#eb630e";
      link.style.fontWeight = "600";
      link.style.backgroundColor = "#fff";
      link.style.boxShadow = "inset 0 3px 5px rgba(0, 0, 0, 0.1)";
    }
  });
}

window.addEventListener("load", () => {
  history.replaceState(null, null, " ");
  const firstSection = sections[0];
  if (firstSection) {
    scrollToSection(firstSection.id);
  }
  updateActiveLink();
});

window.addEventListener("scroll", updateActiveLink);

window.addEventListener("load", () => {
  const introOverlay = document.getElementById("introOverlay");
  setTimeout(() => {
    introOverlay.classList.add("hidden");
  }, 500);
});
