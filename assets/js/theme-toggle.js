// Кнопка переключения (после загрузки)
const body = document.documentElement; // теперь на html
const toggleButton = document.getElementById("theme-toggle");
const icon = toggleButton.querySelector(".icon");

toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  const isDark = body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // Иконка
  icon.textContent = isDark ? "🌙" : "☀️";
});
