// frontend/mapdata.js

// Definer kortdataene, inklusive alle lande
var simplemaps_worldmap_mapdata = {
  main_settings: {
    width: "responsive", //'700' or 'responsive'
    background_color: "#FFFFFF",
    background_transparent: "yes",
    border_color: "#ffffff",
    popups: "detect",

    //State defaults
    state_description: "#data#% har internet",
    state_color: "#88A4BC",
    state_hover_color: "off",
    border_size: "1.5",
    all_states_inactive: "no",
    all_states_zoomable: "no",

    //Location defaults
    location_description: "Location description",
    location_color: "#FF0067",
    location_opacity: 0.8,
    location_hover_opacity: 1,
    location_size: 25,
    location_type: "square",
    location_border_color: "#FFFFFF",
    location_border: 2,
    location_hover_border: 2.5,
    all_locations_inactive: "no",
    all_locations_hidden: "no",

    //Label defaults
    label_color: "#d5ddec",
    label_hover_color: "#d5ddec",
    label_size: 22,
    label_font: "Arial",
    hide_labels: "no",

    //Zoom settings
    zoom: "yes",
    back_image: "no",
    initial_back: "no",
    initial_zoom: -1,
    initial_zoom_solo: "no",
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,

    //Popup settings
    popup_color: "white",
    popup_opacity: 0.9,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
    popup_nocss: "no",

    //Advanced settings
    div: "map",
    auto_load: "yes",
    images_directory: "default",
    fade_time: 0.1,
    border_hover_color: "gray",
  },
  state_specific: {
    AF: { name: "Afghanistan" },
    AL: { name: "Albania" },
    DZ: { name: "Algeria" },
    AD: { name: "Andorra" },
    AO: { name: "Angola" },
    AG: { name: "Antigua and Barbuda" },
    AR: { name: "Argentina" },
    AM: { name: "Armenia" },
    AW: { name: "Aruba" },
    AU: { name: "Australia" },
    AT: { name: "Austria" },
    AZ: { name: "Azerbaijan" },
    BS: { name: "Bahamas" },
    BH: { name: "Bahrain" },
    BD: { name: "Bangladesh" },
    BB: { name: "Barbados" },
    BY: { name: "Belarus" },
    BE: { name: "Belgium" },
    BZ: { name: "Belize" },
    BJ: { name: "Benin" },
    BM: { name: "Bermuda" },
    BT: { name: "Bhutan" },
    BO: { name: "Bolivia" },
    BA: { name: "Bosnia and Herzegovina" },
    BW: { name: "Botswana" },
    BR: { name: "Brazil" },
    VG: { name: "British Virgin Islands" },
    BN: { name: "Brunei" },
    BG: { name: "Bulgaria" },
    BF: { name: "Burkina Faso" },
    BI: { name: "Burundi" },
    CV: { name: "Cabo Verde" },
    KH: { name: "Cambodia" },
    CM: { name: "Cameroon" },
    CA: { name: "Canada" },
    KY: { name: "Cayman Islands" },
    CF: { name: "Central African Republic" },
    TD: { name: "Chad" },
    CL: { name: "Chile" },
    CN: { name: "China" },
    CO: { name: "Colombia" },
    KM: { name: "Comoros" },
    CG: { name: "Congo, Rep." },
    CD: { name: "Congo, Dem. Rep." },
    CR: { name: "Costa Rica" },
    CI: { name: "Cote d'Ivoire" },
    HR: { name: "Croatia" },
    CU: { name: "Cuba" },
    CW: { name: "Curaçao" },
    CY: { name: "Cyprus" },
    CZ: { name: "Czech Republic" },
    DK: { name: "Denmark" },
    DJ: { name: "Djibouti" },
    DM: { name: "Dominica" },
    DO: { name: "Dominican Republic" },
    EC: { name: "Ecuador" },
    EG: { name: "Egypt" },
    SV: { name: "El Salvador" },
    GQ: { name: "Equatorial Guinea" },
    ER: { name: "Eritrea" },
    EE: { name: "Estonia" },
    SZ: { name: "Eswatini" },
    ET: { name: "Ethiopia" },
    FO: { name: "Faeroe Islands" },
    FJ: { name: "Fiji" },
    FI: { name: "Finland" },
    FR: { name: "France" },
    PF: { name: "French Polynesia" },
    GA: { name: "Gabon" },
    GM: { name: "Gambia" },
    GE: { name: "Georgia" },
    DE: { name: "Germany" },
    GH: { name: "Ghana" },
    GR: { name: "Greece" },
    GL: { name: "Greenland" },
    GD: { name: "Grenada" },
    GU: { name: "Guam" },
    GT: { name: "Guatemala" },
    GN: { name: "Guinea" },
    GW: { name: "Guinea-Bissau" },
    GY: { name: "Guyana" },
    HT: { name: "Haiti" },
    HN: { name: "Honduras" },
    HU: { name: "Hungary" },
    IS: { name: "Iceland" },
    IN: { name: "India" },
    ID: { name: "Indonesia" },
    IR: { name: "Iran" },
    IQ: { name: "Iraq" },
    IE: { name: "Ireland" },
    IL: { name: "Israel" },
    IT: { name: "Italy" },
    JM: { name: "Jamaica" },
    JP: { name: "Japan" },
    JO: { name: "Jordan" },
    KZ: { name: "Kazakhstan" },
    KE: { name: "Kenya" },
    KI: { name: "Kiribati" },
    XK: { name: "Kosovo" },
    KW: { name: "Kuwait" },
    KG: { name: "Kyrgyz Republic" },
    LA: { name: "Laos" },
    LV: { name: "Latvia" },
    LB: { name: "Lebanon" },
    LS: { name: "Lesotho" },
    LR: { name: "Liberia" },
    LY: { name: "Libya" },
    LI: { name: "Liechtenstein" },
    LT: { name: "Lithuania" },
    LU: { name: "Luxembourg" },
    MG: { name: "Madagascar" },
    MW: { name: "Malawi" },
    MY: { name: "Malaysia" },
    MV: { name: "Maldives" },
    ML: { name: "Mali" },
    MT: { name: "Malta" },
    MH: { name: "Marshall Islands" },
    MR: { name: "Mauritania" },
    MU: { name: "Mauritius" },
    MX: { name: "Mexico" },
    FM: { name: "Micronesia, Fed. Sts." },
    MD: { name: "Moldova" },
    MC: { name: "Monaco" },
    MN: { name: "Mongolia" },
    ME: { name: "Montenegro" },
    MA: { name: "Morocco" },
    MZ: { name: "Mozambique" },
    MM: { name: "Myanmar" },
    NA: { name: "Namibia" },
    NR: { name: "Nauru" },
    NP: { name: "Nepal" },
    NL: { name: "Netherlands" },
    NC: { name: "New Caledonia" },
    NZ: { name: "New Zealand" },
    NI: { name: "Nicaragua" },
    NE: { name: "Niger" },
    NG: { name: "Nigeria" },
    KP: { name: "North Korea" },
    MK: { name: "North Macedonia" },
    MP: { name: "Northern Mariana Islands" },
    NO: { name: "Norway" },
    OM: { name: "Oman" },
    PK: { name: "Pakistan" },
    PW: { name: "Palau" },
    PS: { name: "Palestine" },
    PA: { name: "Panama" },
    PG: { name: "Papua New Guinea" },
    PY: { name: "Paraguay" },
    PE: { name: "Peru" },
    PH: { name: "Philippines" },
    PL: { name: "Poland" },
    PT: { name: "Portugal" },
    PR: { name: "Puerto Rico" },
    QA: { name: "Qatar" },
    RO: { name: "Romania" },
    RU: { name: "Russia" },
    RW: { name: "Rwanda" },
    KN: { name: "St. Kitts and Nevis" },
    LC: { name: "St. Lucia" },
    VC: { name: "St. Vincent and the Grenadines" },
    WS: { name: "Samoa" },
    SM: { name: "San Marino" },
    ST: { name: "Sao Tome and Principe" },
    SA: { name: "Saudi Arabia" },
    SN: { name: "Senegal" },
    RS: { name: "Serbia" },
    SC: { name: "Seychelles" },
    SL: { name: "Sierra Leone" },
    SG: { name: "Singapore" },
    SK: { name: "Slovakia" },
    SI: { name: "Slovenia" },
    SB: { name: "Solomon Islands" },
    SO: { name: "Somalia" },
    ZA: { name: "South Africa" },
    KR: { name: "South Korea" },
    SS: { name: "South Sudan" },
    ES: { name: "Spain" },
    LK: { name: "Sri Lanka" },
    SD: { name: "Sudan" },
    SR: { name: "Suriname" },
    SE: { name: "Sweden" },
    CH: { name: "Switzerland" },
    SY: { name: "Syria" },
    TW: { name: "Taiwan" },
    TJ: { name: "Tajikistan" },
    TZ: { name: "Tanzania" },
    TH: { name: "Thailand" },
    TL: { name: "Timor-Leste" },
    TG: { name: "Togo" },
    TO: { name: "Tonga" },
    TT: { name: "Trinidad and Tobago" },
    TN: { name: "Tunisia" },
    TR: { name: "Turkey" },
    TM: { name: "Turkmenistan" },
    TC: { name: "Turks and Caicos Islands" },
    TV: { name: "Tuvalu" },
    AE: { name: "UAE" },
    UG: { name: "Uganda" },
    UA: { name: "Ukraine" },
    GB: { name: "United Kingdom" },
    US: { name: "United States" },
    UY: { name: "Uruguay" },
    UZ: { name: "Uzbekistan" },
    VU: { name: "Vanuatu" },
    VE: { name: "Venezuela" },
    VN: { name: "Vietnam" },
    VI: { name: "Virgin Islands (U.S.)" },
    YE: { name: "Yemen" },
    ZM: { name: "Zambia" },
    ZW: { name: "Zimbabwe" },
  },
};
