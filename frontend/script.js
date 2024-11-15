// frontend/script.js

// Fetch data baseret på valget af radio knappen
function fetchDataWifi() {
  const year = d3.select("#year").property("value");
  d3.json(`/api/internet_usage?type=wifi&year=${year}`).then((data) => {
    updateMap(data, year);
  });
}

function fetchDataMobil() {
  const year = d3.select("#year").property("value");
  d3.json(`/api/internet_usage?type=mobil&year=${year}`).then((data) => {
    updateMap(data, year);
  });
}

function fetchDataComputer() {
  const year = d3.select("#year").property("value");
  d3.json(`/api/internet_usage?type=computer&year=${year}`).then((data) => {
    updateMap(data, year);
  });
}

// Funktion til at opdatere kortet med data
function updateMap(data, year) {
  if (data.length === 0) {
    d3.select("#visuals").html("No data found for this year.");
    return;
  }

  data.forEach((countryData) => {
    const countryId = countryIdMap[countryData.country];
    if (countryId && simplemaps_worldmap_mapdata.state_specific[countryId]) {
      simplemaps_worldmap_mapdata.state_specific[countryId].color =
        calculateColor(countryData.internet_usage);
      simplemaps_worldmap_mapdata.state_specific[
        countryId
      ].description = `${countryData.country} - år ${year} - Internetforbrug: ${countryData.internet_usage}%`;
    } else {
      console.warn(`Country element for "${countryData.country}" not found`);
    }
  });

  simplemaps_worldmap.refresh();
}

// Lyt efter valg af radioknap
document.getElementById("year-selector").addEventListener("click", function () {
  const wifiSelected = document.getElementById("Wifi").checked;
  const mobilSelected = document.getElementById("Mobil").checked;
  const computerSelected = document.getElementById("Computer").checked;

  if (wifiSelected) {
    fetchDataWifi();
  } else if (mobilSelected) {
    fetchDataMobil();
  } else if (computerSelected) {
    fetchDataComputer();
  } else {
    console.log("Vælg en kategori for at hente data.");
  }
});

// Beregner farve baseret på internetbrug i procent
function calculateColor(usage) {
  if (usage <= 20) return "#7badff";
  else if (usage <= 50) return "#5a9ff7";
  else if (usage <= 80) return "#357fef";
  return "#f23030";
}
// Mapping af lande til ISO-koder, så de kan findes på kortet
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
