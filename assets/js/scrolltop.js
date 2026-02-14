// @ts-check

const scrollBtn = document.querySelector(".scroll-top");

if (scrollBtn instanceof HTMLElement) {
  let rafId;

  window.addEventListener("scroll", () => {
    if (rafId) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      scrollBtn.classList.toggle("show", window.scrollY > 200);
    });
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
