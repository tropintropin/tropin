// @ts-check

async function loadSvgs() {
  await Promise.all(
    Array.from(document.querySelectorAll(".icon-link"))
      .filter((el) => el instanceof HTMLElement)
      .map(async (el) => {
        const svgUrl = el.dataset.svg;
        if (!svgUrl) return;

        try {
          el.innerHTML = await (await fetch(svgUrl)).text();
        } catch (err) {
          console.error(`Failed to load SVG from ${svgUrl}:`, err);
        }
      })
  );
}

loadSvgs();
