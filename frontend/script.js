// frontend/script.js

// Funktion til at hente data om internet baseret på det valgte år
function fetchDataWifi() {
  // Hent det valgte år fra DOM'en ved at få værdien af 'data-selected-year' attributten fra elementet med id 'year'
  const year = d3.select("#year").attr("data-selected-year");

  // Send en HTTP GET-request til API'et for at hente data om internet for det valgte år
  d3.json(`/api/internet_usage?type=wifi&year=${year}`).then((Wifidata) => {
    // Når dataene er hentet, opdater kortet med de nye data om internet
    updateMap(Wifidata, year, "internet_usage");
  });
}

// Funktion til at hente data om mobiltelefoner pr. 100 indbyggere baseret på det valgte år
function fetchDataMobil() {
  // Hent det valgte år fra DOM'en
  const year = d3.select("#year").attr("data-selected-year");

  // Send en HTTP GET-request til API'et for at hente data om mobiltelefoner pr. 100 indbyggere for det valgte år
  d3.json(`/api/telephones_100?type=mobil&year=${year}`).then((Mobildata) => {
    // Når dataene er hentet, opdater kortet med de nye data om mobiltelefoner pr. 100 indbygger
    updateMap(Mobildata, year, "telephones_per_100");
  });
}

// Funktion til at hente data om adgang til elektricitet baseret på det valgte år
function fetchDataElectricity() {
  // Hent det valgte år fra DOM'en
  const year = d3.select("#year").attr("data-selected-year");

  // Send en HTTP GET-request til API'et for at hente data om elektricitet for det valgte år
  d3.json(`/api/electricity_percentage?type=electricity&year=${year}`).then(
    (ElectricityData) => {
      // Når dataene er hentet, opdater kortet med de nye data om elektricitet
      updateMap(ElectricityData, year, "electricity_access_percentage");
    }
  );
}

function updateMap(data, year, dataType) {
  if (data.length === 0) {
    d3.select("#visuals").html("No data found for this year.");
    return;
  }

  // Opdater kortfarver og beskrivelser for hver lands data
  data.forEach((countryData) => {
    // Find det unikke ID for landet baseret på landets navn
    const countryId = countryIdMap[countryData.country];

    // Tjek om landet findes i kortdataene (simplemaps_worldmap_mapdata)
    if (countryId && simplemaps_worldmap_mapdata.state_specific[countryId]) {
      // Tjek dataType og anvend den rette farveberegningsfunktion baseret på typen af data
      if (dataType === "internet_usage") {
        // Beregn farven for landets internetforbrug og opdater kortet
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorWifi(countryData.internet_usage);
        // Opdater beskrivelsen for landet
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Internetforbrug: ${countryData.internet_usage}%`;
      } else if (dataType === "telephones_per_100") {
        // Beregn farven for mobiltelefoner pr. 100 indbyggere og opdater kortet
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorMobil(countryData.telephones_per_100);
        // Opdater beskrivelsen for landet
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Telefoner pr. 100 indbyggere: ${countryData.telephones_per_100}`;
      } else if (dataType === "electricity_access_percentage") {
        // Beregn farven for elektricitet og opdater kortet
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorComputer(countryData.electricity_access_percentage);
        // Opdater beskrivelsen for landet
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Elektricitet i procent: ${countryData.electricity_access_percentage}%`;
      } else {
        // Hvis der ikke findes en matchende dataType, log en advarsel
        console.warn(`Country element for "${countryData.country}" not found`);
      }
    }
  });

  // Opdater farveinfo baseret på den aktuelle dataType
  updateFarveInfo(dataType);

  // Opdater kortet med de nye farver og beskrivelser
  simplemaps_worldmap.refresh();
}
// Håndter første sæt radioknapper
document.querySelectorAll('input[name="main-radio"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const mellemlag = document.getElementById("mellemlag");
    const valgtindhold = document.getElementById("valgt-indhold");

    // Vis det andet sæt knapper
    mellemlag.style.display = "block";

    // Fremhæv valgt kategori
    if (radio.id === "forlaginternet") {
      valgtindhold.textContent = "Du har valgt: Internet.";
    } else if (radio.id === "forlagmobil") {
      valgtindhold.textContent = "Du har valgt: Mobil.";
    } else if (radio.id === "forlagelektricitet") {
      valgtindhold.textContent = "Du har valgt: Elektricitet.";
    }
  });
});

// Håndter andet sæt radioknapper
document.querySelectorAll('input[name="value-radio"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    if (radio.id === "Wifi") {
      fetchDataWifi();
    } else if (radio.id === "Mobil") {
      fetchDataMobil();
    } else if (radio.id === "Computer") {
      fetchDataElectricity();
    }
  });
});

// Dummy fetchData funktioner (til debugging)
function fetchDataWifi() {
  console.log("Henter Wifi data...");
}

function fetchDataMobil() {
  console.log("Henter Mobil data...");
}

function fetchDataElectricity() {
  console.log("Henter Elektricitet data...");
}

document
  .querySelectorAll('input[name="value-radio"]')
  .forEach(function (radio) {
    radio.addEventListener("change", function () {
      const valgtindhold = document.getElementById("valgt-indhold");

      if (radio.id === "Wifi") {
        valgtindhold.textContent = "Wifi data er baseret på brug af internet";
      } else if (radio.id === "Mobil") {
        valgtindhold.textContent =
          "Mobil data er baseret på abonommenter pr 100 indbygger";
      } else if (radio.id === "Computer") {
        valgtindhold.textContent = "Elektricitet er baseret på hej!";
      }
    });
  });

const observer = new MutationObserver(() => {
  const selected = document.querySelector("#year-selector .selected");
  if (selected) {
    if (document.getElementById("Wifi").checked) {
      fetchDataWifi();
    } else if (document.getElementById("Mobil").checked) {
      fetchDataMobil();
    } else if (document.getElementById("Computer").checked) {
      fetchDataElectricity();
    }
  } else {
    console.log("Ingen valg fundet.");
  }
});

// Overvåg ændringer i #year-selector
const yearSelector = document.getElementById("year-selector");
if (yearSelector) {
  observer.observe(yearSelector, {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
} else {
  console.error("#year-selector ikke fundet i DOM'en");
}

// Farveberegninger
function calculateColorWifi(usage) {
  if (usage <= 0) return "darkgray";
  else if (usage <= 20) return "#D0E8F2";
  else if (usage <= 40) return "#90C3E0";
  else if (usage <= 60) return "#5A9FCE";
  else if (usage <= 80) return "#297CBF";
  return "#0B4D8C";
}

function calculateColorMobil(usage) {
  if (usage <= 0) return "darkgray";
  else if (usage <= 20) return "#D4EED1"; //Meget lys grøn
  else if (usage <= 40) return "#A3D18C"; //lys grøn
  else if (usage <= 60) return "#6FBF4B "; //mellem grøn
  else if (usage <= 80) return "#3E9D25"; //mørkere grøn
  return "#1D8A13"; //mørk grøn
}

function calculateColorComputer(usage) {
  if (usage <= 0) return "darkgray";
  else if (usage <= 20) return "#FFF7CC";
  else if (usage <= 40) return "#FFE680";
  else if (usage <= 60) return "#FFC140";
  else if (usage <= 80) return "#FF9A3C";
  return "#FF7A00";
}

function updateFarveInfo(dataType) {
  const farveInfo = d3.select("#farve-info");
  farveInfo.html(""); // Ryd eksisterende indhold

  let colorScale = [];
  if (dataType === "internet_usage") {
    colorScale = [
      { label: "0%", color: "darkgray" },
      { label: "1-20%", color: "#D0E8F2" },
      { label: "21-40%", color: "#90C3E0" },
      { label: "41-60%", color: "#5A9FCE" },
      { label: "61-80%", color: "#297CBF" },
      { label: "81-100%", color: "#0B4D8C" },
    ];
  } else if (dataType === "telephones_per_100") {
    colorScale = [
      { label: "0", color: "darkgray" },
      { label: "1-20", color: "#D4EED1" },
      { label: "21-40", color: "#A3D18C" },
      { label: "41-60", color: "#6FBF4B" },
      { label: "61-80", color: "#3E9D25" },
      { label: "81+", color: "#1D8A13" },
    ];
  } else if (dataType === "electricity_access_percentage") {
    colorScale = [
      { label: "0%", color: "darkgray" },
      { label: "1-20%", color: "#FFF7CC" },
      { label: "21-40%", color: "#FFE680" },
      { label: "41-60%", color: "#FFC140" },
      { label: "61-80%", color: "#FF9A3C" },
      { label: "81-100%", color: "#FF7A00" },
    ];
  }

  // Opret farveskalaens elementer
  colorScale.forEach((info) => {
    farveInfo
      .append("div")
      .style("display", "flex")
      .style("align-items", "right")
      .style("margin", "5px 0")
      .html(
        `<span style="display: inline-block; width: 20px; height: 20px; background-color: ${info.color}; margin-right: 8px;"></span>${info.label}`
      );
  });
}

// Funktion til at hente det aktuelt valgte år fra DOM'en
// Hvis ingen værdi er valgt, returneres standardåret 1990
function getSelectedYear() {
  const selectedYear = d3.select("#year").attr("data-selected-year"); // Hent år fra attributten 'data-selected-year' på elementet med id "year"
  return selectedYear || "1990"; // Hvis der ikke er valgt et årstal, brug 1990 som standardværdi
}

// Tilføj event listener for WiFi-valg
// Når brugeren vælger WiFi, hentes data for det aktuelt valgte år
document.getElementById("Wifi").addEventListener("change", () => {
  const year = getSelectedYear(); // Hent det aktuelt valgte år
  fetchDataWifi("wifi", year); // Kald funktionen fetchDataWifi med parametrene "wifi" og det valgte år
});

// Tilføj event listener for Mobil-valg
// Når brugeren vælger Mobil, hentes data for det aktuelt valgte år
document.getElementById("Mobil").addEventListener("change", () => {
  const year = getSelectedYear(); // Hent det aktuelt valgte år
  fetchDataMobil("mobil", year); // Kald funktionen fetchDataMobil med parametrene "mobil" og det valgte år
});

// Tilføj event listener for Computer-valg
// Når brugeren vælger Computer, hentes data for det aktuelt valgte år
document.getElementById("Computer").addEventListener("change", () => {
  const year = getSelectedYear(); // Hent det aktuelt valgte år
  fetchDataElectricity("electricity", year); // Kald funktionen fetchDataElectricity med parametrene "electricity" og det valgte år
});

const countryIdMap = {
  Afghanistan: "AF",
  Albania: "AL",
  Algeria: "DZ",
  Andorra: "AD",
  Angola: "AO",
  "Antigua and Barbuda": "AG",
  Argentina: "AR",
  Armenia: "AM",
  Aruba: "AW",
  Australia: "AU",
  Austria: "AT",
  Azerbaijan: "AZ",
  Bahamas: "BS",
  Bahrain: "BH",
  Bangladesh: "BD",
  Barbados: "BB",
  Belarus: "BY",
  Belgium: "BE",
  Belize: "BZ",
  Benin: "BJ",
  Bermuda: "BM",
  Bhutan: "BT",
  Bolivia: "BO",
  "Bosnia and Herzegovina": "BA",
  Botswana: "BW",
  Brazil: "BR",
  "British Virgin Islands": "VG",
  Brunei: "BN",
  Bulgaria: "BG",
  "Burkina Faso": "BF",
  Burundi: "BI",
  "Cabo Verde": "CV",
  Cambodia: "KH",
  Cameroon: "CM",
  Canada: "CA",
  "Central African Republic": "CF",
  "Cape Verde": "CV",
  "Cayman Islands": "KY",
  Chad: "TD",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  Comoros: "KM",
  "Congo, Rep.": "CG",
  "Congo, Dem. Rep.": "CD",
  "Costa Rica": "CR",
  "Cote d'Ivoire": "CI",
  Croatia: "HR",
  Cuba: "CU",
  Curaçao: "CW",
  Cyprus: "CY",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Djibouti: "DJ",
  Dominica: "DM",
  "Dominican Republic": "DO",
  Ecuador: "EC",
  Egypt: "EG",
  "El Salvador": "SV",
  "Equatorial Guinea": "GQ",
  Eritrea: "ER",
  Estonia: "EE",
  Eswatini: "SZ",
  Ethiopia: "ET",
  "Faeroe Islands": "FO",
  Fiji: "FJ",
  Finland: "FI",
  France: "FR",
  "French Polynesia": "PF",
  Gabon: "GA",
  Gambia: "GM",
  Georgia: "GE",
  Germany: "DE",
  Ghana: "GH",
  Greece: "GR",
  Greenland: "GL",
  Grenada: "GD",
  Guam: "GU",
  Guatemala: "GT",
  Guinea: "GN",
  "Guinea-Bissau": "GW",
  Guyana: "GY",
  Haiti: "HT",
  Honduras: "HN",
  Hungary: "HU",
  Iceland: "IS",
  India: "IN",
  Indonesia: "ID",
  Iran: "IR",
  Iraq: "IQ",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Jamaica: "JM",
  Japan: "JP",
  Jordan: "JO",
  Kazakhstan: "KZ",
  Kenya: "KE",
  Kiribati: "KI",
  Kosovo: "XK",
  Kuwait: "KW",
  "Kyrgyz Republic": "KG",
  Laos: "LA",
  Latvia: "LV",
  Lebanon: "LB",
  Lesotho: "LS",
  Liberia: "LR",
  Libya: "LY",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Luxembourg: "LU",
  Madagascar: "MG",
  Malawi: "MW",
  Malaysia: "MY",
  Maldives: "MV",
  Mali: "ML",
  Malta: "MT",
  "Marshall Islands": "MH",
  Mauritania: "MR",
  Mauritius: "MU",
  Mexico: "MX",
  "Micronesia, Fed. Sts.": "FM",
  Moldova: "MD",
  Monaco: "MC",
  Mongolia: "MN",
  Montenegro: "ME",
  Morocco: "MA",
  Mozambique: "MZ",
  Myanmar: "MM",
  Namibia: "NA",
  Nauru: "NR",
  Nepal: "NP",
  Netherlands: "NL",
  "New Caledonia": "NC",
  "New Zealand": "NZ",
  Nicaragua: "NI",
  Niger: "NE",
  Nigeria: "NG",
  "North Korea": "KP",
  "North Macedonia": "MK",
  "Northern Mariana Islands": "MP",
  Norway: "NO",
  Oman: "OM",
  Pakistan: "PK",
  Palau: "PW",
  Palestine: "PS",
  Panama: "PA",
  "Papua New Guinea": "PG",
  Paraguay: "PY",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  "Puerto Rico": "PR",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  Rwanda: "RW",
  "St. Kitts and Nevis": "KN",
  "St. Lucia": "LC",
  "St. Vincent and the Grenadines": "VC",
  Samoa: "WS",
  "San Marino": "SM",
  "Sao Tome and Principe": "ST",
  "Saudi Arabia": "SA",
  Senegal: "SN",
  Serbia: "RS",
  Seychelles: "SC",
  "Sierra Leone": "SL",
  Singapore: "SG",
  Slovakia: "SK",
  Slovenia: "SI",
  "Solomon Islands": "SB",
  Somalia: "SO",
  "South Africa": "ZA",
  "South Korea": "KR",
  "South Sudan": "SS",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sudan: "SD",
  Suriname: "SR",
  Sweden: "SE",
  Switzerland: "CH",
  Syria: "SY",
  Taiwan: "TW",
  Tajikistan: "TJ",
  Tanzania: "TZ",
  Thailand: "TH",
  "Timor-Leste": "TL",
  Togo: "TG",
  Tonga: "TO",
  "Trinidad and Tobago": "TT",
  Tunisia: "TN",
  Turkey: "TR",
  Turkmenistan: "TM",
  "Turks and Caicos Islands": "TC",
  Tuvalu: "TV",
  UAE: "AE",
  Uganda: "UG",
  Ukraine: "UA",
  UK: "GB",
  USA: "US",
  Uruguay: "UY",
  Uzbekistan: "UZ",
  Vanuatu: "VU",
  Venezuela: "VE",
  Vietnam: "VN",
  "Virgin Islands (U.S.)": "VI",
  Yemen: "YE",
  Zambia: "ZM",
  Zimbabwe: "ZW",
};
