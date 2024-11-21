const GrafInternet = document.getElementById("GrafInternet");
const GrafMobil = document.getElementById("GrafMobil");
const GrafElektricitet = document.getElementById("GrafElektricitet");
//Knapperne
const GrafElektricitetLag = document.getElementById("checkedelektricitet");
const GrafInternetLag = document.getElementById("checkedinternet");
const GrafMobilLag = document.getElementById("checkedmobil");
//Colored squares :)

function toggleOpacity(layer, knappen) {
  if (layer.style.opacity === "1") {
    layer.style.opacity = "0";
  } else {
    layer.style.opacity = "1";
  }
  console.log(`${knappen} Blev trykket på`);
}

GrafInternet.addEventListener("click", () =>
  toggleOpacity(GrafInternetLag, "GrafInternet")
);
GrafMobil.addEventListener("click", () =>
  toggleOpacity(GrafMobilLag, "GrafMobil")
);
GrafElektricitet.addEventListener("click", () =>
  toggleOpacity(GrafElektricitetLag, "GrafElektricitet")
);
