document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("pre[class*='language-']").forEach((pre) => {
    pre.style.position = "relative";

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "Copy";

    btn.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.innerText.trim());
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      } catch (err) {
        console.error("Copy failed", err);
      }
    });

    pre.appendChild(btn);
  });
});
