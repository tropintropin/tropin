document.querySelectorAll(".icon-link").forEach((link) => {
  const svgUrl = link.dataset.svg;
  fetch(svgUrl)
    .then((res) => res.text())
    .then((svg) => (link.innerHTML = svg));
});
