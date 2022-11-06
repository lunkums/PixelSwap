const matchingMethodSelector = document.getElementById("matching-method");
matchingMethodSelector.onchange = (e) => {
  ColorMatchingMethod = e.target.value;
};

const MatchingMethods = {
  CIELAB: "CIELAB",
  Weighted: "Weighted",
  Euclidean: "Euclidean",
};

let ColorMatchingMethod = matchingMethodSelector.value;
