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
const scrollableDiv = document.getElementById("year-selector");
// Finder det scrollbare element med id'et 'year-selector'.
const yearDiv = document.getElementById("year");
// Finder elementet med id'et 'year', som indeholder årstallene.
yearDiv.setAttribute("data-selected-year", "1990");
// Indstiller en standardværdi for det valgte år til 1990.

let startx = 0;
// Initialiserer startpositionen for de årstal, der skal placeres.
for (let year = 1990; year <= 2022; year++) {
  // Loop, der opretter årstalselementer fra 1990 til 2022.
  if (year == 1990) {
    // Hvis året er 1990, tilføj to pladsholdere foran for at centrere.
    yearDiv.getAttribute("data-selected-year");
    const placeholder1 = document.createElement("div");
    placeholder1.className = "year";
    const placeholder2 = document.createElement("div");
    placeholder2.className = "year";
    yearDiv.appendChild(placeholder1);
    yearDiv.appendChild(placeholder2);
  }
  const yearElement = document.createElement("div");
  // Opretter en ny div til hvert år.
  yearElement.dataset.xvalue = startx;
  // Tildeler en x-position for dette år.
  startx = startx + 47;
  // Opdaterer x-positionen for det næste element.
  yearElement.innerText = year;
  // Indsætter årstallet som tekst i div'en.
  yearElement.className = "year";
  // Giver div'en klassen "year".
  yearElement.dataset.year = year;
  // Tilføjer en data-attribut med årstallet.

  yearElement.onclick = () => {
    // Definerer, hvad der sker, når et årstal bliver klikket på.
    const x = yearElement.dataset.xvalue;
    // Henter x-positionen for det klikkede element.
    scrollToPosition(x, 200);
    // Ruller til x-positionen på 969 ms.
    scrollableDiv.scrollLeft = x;
    // Flytter scroll-positionen direkte.
    yearDiv.setAttribute("data-selected-year", year);
    // Opdaterer det valgte år i 'data-selected-year'.
    document
      .querySelectorAll(".year")
      .forEach((el) => el.classList.remove("selected"));
    // Fjerner klassen "selected" fra alle år.
    yearElement.classList.add("selected");
    // Tilføjer klassen "selected" til det klikkede år.
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
}

let timer = null;
// Initialiserer timer-variablen til at tracke scroll.
let ignorescrolling = false;
// En flag-variabel, der forhindrer gentagne scroll-hændelser.

// Forbered 'childDivs' og 'xValues' én gang
const childDivs = Array.from(yearDiv.querySelectorAll("div"));
// Henter alle div-elementer i yearDiv som en array.
const xValues = childDivs
  .map((div) => parseInt(div.getAttribute("data-xvalue")))
  .filter((value) => !isNaN(value));
// Opretter en liste over x-positioner, hvor værdier ikke er NaN.

scrollableDiv.addEventListener("scroll", () => {
  // Lyt efter scroll-events på scrollableDiv.
  if (ignorescrolling) return;
  // Hvis ignorescrolling er aktivt, afbryd håndtering af scroll.

  if (timer !== null) {
    clearTimeout(timer);
    // Nulstil timeren, hvis der allerede er en i gang.
  }

  timer = setTimeout(function () {
    // Start en ny timeout, der aktiveres, når brugeren stopper med at scrolle.
    let scrollX = scrollableDiv.scrollLeft;
    // Hent den aktuelle scroll-position i scrollableDiv.

    // Find den nærmeste xValue
    let closestValue = null;
    let smallestdifference = Infinity;
    xValues.forEach((index) => {
      // Gennemgå hver xValue for at finde den, der er tættest på scrollX.
      const forskel = Math.abs(index - scrollX);
      if (forskel < smallestdifference) {
        smallestdifference = forskel;
        closestValue = index;
        // Opdater den tætteste værdi.
      }
    });

    const closestYearElement = document.querySelector(
      `[data-xvalue="${closestValue}"]`
    );
    // Find det element, der matcher den nærmeste xValue.

    if (closestYearElement) {
      const year = closestYearElement.getAttribute("data-year");
      // Hent årstallet for det nærmeste element.

      // Tilføj 'selected' class til det nærmeste år
      document
        .querySelectorAll(".year")
        .forEach((el) => el.classList.remove("selected"));
      // Fjern 'selected' fra alle år.
      closestYearElement.classList.add("selected");
      // Tilføj 'selected' til det nærmeste år.

      scrollToPosition(closestValue, 500);
      // Scroll til den nærmeste x-position med en smooth animation.
      yearDiv.setAttribute("data-selected-year", year);
      // Opdater attributten 'data-selected-year' med det nye valgte år.

      // Midlertidigt ignorér scroll-events
      ignorescrolling = true;
      // Aktiver ignorescrolling for at forhindre yderligere event-håndtering.
      scrollableDiv.scrollLeft = closestValue;
      // Sæt scroll-positionen direkte til den nærmeste værdi.

      // Nulstil ignorescrolling efter en kort tid
      setTimeout(() => {
        ignorescrolling = false;
        // Tillad scroll-events igen efter animationen er færdig.
      }, 600); // Skal være lidt længere end varigheden af scrollToPosition.

      console.log("Global log: Selected year after scroll is now:", year);
      // Log det valgte år til konsollen.
    }
  }, 200); // Ventetid i millisekunder før timeout-funktionen aktiveres.
});

function scrollToPosition(targetPosition, duration) {
  // Funktion til at scrolle til en given position over en given tid.
  const element = document.getElementById("year-selector");
  const startPosition = element.scrollLeft;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsedTime = currentTime - startTime;
    // Beregner hvor meget tid der er gået siden scroll-start.
    const progress = Math.min(elapsedTime / duration, 1);
    // Beregner progress fra 0 til 1.

    const easing =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
    // Brug en ease-in-out funktion for at gøre animationen glat.

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
  // Forhindrer scroll-hændelser under animationen.

  requestAnimationFrame(animateScroll);
  // Starter animationen.
}

let typed = new Typed("#autoskrivning", {
  strings: [
    "Velkommen til vores side 🙂",
    "Hvad ved du egentlig om Wifi, Internet, og Mobilers udvikling igennem tiden?",
  ],
  typeSpeed: 15,
  startDelay: 700,
  backDelay: 1000,
  backSpeed: 20,
});
const texts = {
  PopMobil:
    "Siden 1990’erne har der været fart på mobilens udvikling. Både vægten og prisen styrtdykkede, og i 1995 var der flere end én million mobiltelefonejere på verdensplan. Så altså stadig forsvindende få i forhold til i dag. I 2004 overhalede antallet af mobilabonnenter antallet af fastnetabonnenter, og i dag bruger 97 procent af danskerne en mobiltelefon eller smartphone.",
  PopInternet:
    "Et internet er betegnelsen for et netværk af computernetværk, som er koblet sammen. Ofte taler man om internettet, der så betegner et globalt netværk af datanet-værter (computere). Internettet er en af de vigtigste opfindelser fra det 20. århundrede. Ikke fordi det i sig selv er noget teknisk vidunder, men på grund af de store konsekvenser det allerede har for vores måde at leve vores liv på.",
  PopEl:
    "Danmark blev i 1997 for første gang i nyere tid selvforsynende med energi. En stigende produktion fra olie- og gasfelterne i Nordsøen sammenholdt med et stagnerende forbrug betød, at selvforsyningsgraden voksede til 155 % i 2004 mod 52 % i 1990 og 5% i 1980. Siden er produktionen af både olie og gas faldet, så selvforsyningsgraden i 2021 var 55 %.",
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

//navbar
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll("#topBarKnapper .radio .name");

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  const offset = 100;
  const targetTop = section.offsetTop - offset;
  const scrollDuration = 500;
  const startPosition = window.scrollY;
  const distance = targetTop - startPosition;
  const startTime = performance.now();

  // Funktion til at animere scrollen
  function scrollAnimation(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / scrollDuration, 1);
    const scrollPosition = startPosition + distance * progress;

    window.scrollTo(0, scrollPosition);

    // Hvis scrollen ikke er færdig, fortsæt animationen
    if (progress < 1) {
      requestAnimationFrame(scrollAnimation);
    }
  }

  // Start animationen
  requestAnimationFrame(scrollAnimation);
}

function updateActiveLink() {
  const offset = 100;
  let currentSection = null;

  // Gennemgå alle sektioner og find den synlige sektion
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - offset;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  // Gennemgå alle links og tilføj/fjern 'active' klassen baseret på synlig sektion
  navLinks.forEach((link) => {
    const isActive = link
      .getAttribute("onclick", "scroll")
      .includes(currentSection);

    // Fjern 'active' klassen og stilene
    if (!isActive) {
      link.classList.remove("active");
      link.style.color = "rgba(51, 65, 85, 1)"; // Standard farve
      link.style.fontWeight = "normal"; // Standard vægt
      link.style.backgroundColor = "transparent"; // Ingen baggrund
      link.style.boxShadow = "none"; // Fjern box-shadow
    } else {
      // Tilføj 'active' klassen og stilene
      link.classList.add("active");
      link.style.color = "#eb630e"; // Aktiv farve
      link.style.fontWeight = "600"; // Fed tekst
      link.style.backgroundColor = "#fff"; // Hvid baggrund
      link.style.boxShadow = "inset 0 3px 5px rgba(0, 0, 0, 0.1)"; // Indre skygge
    }
  });
}

// Sørg for, at sektion1 er aktiv ved sideindlæsning
window.addEventListener("load", () => {
  const firstLink = navLinks[0]; // Få den første nav-link
  firstLink.classList.add("active");
  firstLink.style.color = "#eb630e";
  firstLink.style.fontWeight = "600";
  firstLink.style.backgroundColor = "#fff";
  firstLink.style.boxShadow = "inset 0 3px 5px rgba(0, 0, 0, 0.1)";

  // Opdater active-link under scroll
  updateActiveLink();
});

// Opdater links under scroll
window.addEventListener("scroll", updateActiveLink);
