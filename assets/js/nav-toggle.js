// @ts-check

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-list");

  if (!(toggle instanceof HTMLElement) || !(menu instanceof HTMLElement))
    return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("active");
    toggle.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target instanceof Node &&
      !menu.contains(target) &&
      !toggle.contains(target)
    ) {
      menu.classList.remove("active");
      toggle.classList.remove("open");
    }
  });
});
