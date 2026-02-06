document.querySelectorAll(".carousel-container").forEach((container) => {
  const track = container.querySelector(".carousel-track");
  const btnPrev = container.querySelector(".carousel-btn.prev");
  const btnNext = container.querySelector(".carousel-btn.next");
  const counter = container.querySelector(".carousel-counter");
  const items = container.querySelectorAll(".carousel-item");
  const totalItems = items.length;

  const updateUI = () => {
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const itemWidth = track.clientWidth;

    btnPrev.classList.toggle("hidden", scrollLeft <= 1);
    btnNext.classList.toggle("hidden", scrollLeft >= maxScroll - 1);

    const currentIndex = Math.round(scrollLeft / itemWidth) + 1;
    if (counter) {
      counter.innerText = `${currentIndex} / ${totalItems}`;
    }
  };

  btnPrev.addEventListener("click", () => {
    track.scrollBy({ left: -track.clientWidth, behavior: "smooth" });
  });

  btnNext.addEventListener("click", () => {
    track.scrollBy({ left: track.clientWidth, behavior: "smooth" });
  });

  track.addEventListener("scroll", updateUI);

  updateUI();

  window.addEventListener("resize", updateUI);
});
