// frontend/script.js

// Fetch data baseret på valget af radio knappen
function fetchDataWifi() {
  const year = d3.select("#year").attr("data-selected-year");
  d3.json(`/api/internet_usage?type=wifi&year=${year}`).then((Wifidata) => {
    updateMap(Wifidata, year, "internet_usage");
  });
}

function fetchDataMobil() {
  const year = d3.select("#year").attr("data-selected-year");
  d3.json(`/api/telephones_100?type=mobil&year=${year}`).then((Mobildata) => {
    updateMap(Mobildata, year, "telephones_per_100");
  });
}

function fetchDataElectricity() {
  const year = d3.select("#year").attr("data-selected-year");
  d3.json(`/api/electricity_percentage?type=electricity&year=${year}`).then(
    (ElectricityData) => {
      updateMap(ElectricityData, year, "electricity_access_percentage");
    }
  );
}

function updateMap(data, year, dataType) {
  if (data.length === 0) {
    d3.select("#visuals").html("No data found for this year.");
    return;
  }

  // Opdater kortfarver og beskrivelser
  data.forEach((countryData) => {
    const countryId = countryIdMap[countryData.country];
    if (countryId && simplemaps_worldmap_mapdata.state_specific[countryId]) {
      // Tjek dataType og anvend den rette farveberegningsfunktion
      if (dataType === "internet_usage") {
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorWifi(countryData.internet_usage);
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Internetforbrug: ${countryData.internet_usage}%`;
      } else if (dataType === "telephones_per_100") {
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorMobil(countryData.telephones_per_100);
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Telefoner pr. 100 indbyggere: ${countryData.telephones_per_100}`;
      } else if (dataType === "electricity_access_percentage") {
        simplemaps_worldmap_mapdata.state_specific[countryId].color =
          calculateColorComputer(countryData.electricity_access_percentage);
        simplemaps_worldmap_mapdata.state_specific[
          countryId
        ].description = `${countryData.country} - år ${year} - Elektricitet i procent: ${countryData.electricity_access_percentage}%`;
      } else {
        console.warn(`Country element for "${countryData.country}" not found`);
      }
    }
  });

  // Opdater farveinfo
  updateFarveInfo(dataType);

  // Opdater kortet
  simplemaps_worldmap.refresh();
}

// Overvåg ændringer i det valgte år
const observer = new MutationObserver(() => {
  const selected = document.querySelector("#year-selector .selected");
  if (selected) {
    if (document.getElementById("Wifi").checked) fetchDataWifi();
    else if (document.getElementById("Mobil").checked) fetchDataMobil();
    else if (document.getElementById("Computer").checked)
      fetchDataElectricity();
  }
});

observer.observe(document.getElementById("year-selector"), {
  subtree: true,
  attributes: true,
  attributeFilter: ["class"],
});

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
  else if (usage <= 20) return "#D4EED1";
  else if (usage <= 40) return "#A3D18C";
  else if (usage <= 60) return "#6FBF4B";
  else if (usage <= 80) return "#3E9D25";
  return "#1D8A13";
}

function calculateColorComputer(usage) {
  if (usage <= 0) return "darkgray";
  else if (usage <= 20) return "#FAD4D4";
  else if (usage <= 40) return "#F28B8B";
  else if (usage <= 60) return "#E64949";
  else if (usage <= 80) return "#B22222";
  return "#7D0B0B";
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
      { label: "1-20%", color: "#FAD4D4" },
      { label: "21-40%", color: "#F28B8B" },
      { label: "41-60%", color: "#E64949" },
      { label: "61-80%", color: "#B22222" },
      { label: "81-100%", color: "#7D0B0B" },
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
