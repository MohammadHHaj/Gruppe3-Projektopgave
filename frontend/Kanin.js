document.addEventListener("DOMContentLoaded", function () {
  const laget = document.getElementById("forlaget");
  const btnclick = [
    document.getElementById("Mobil"),
    document.getElementById("Wifi"),
    document.getElementById("Computer"),
  ];

  btnclick.forEach((button) => {
    if (button) {
      console.log(`Fjerning af forlaget igennem knap ${button.id} fungerede.`);
      button.addEventListener("click", function () {
        laget.style.display = "none";
      });
    }
  });
});
