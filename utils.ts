export function setDarkMode() {
  document.documentElement.style.setProperty("--body-bg-color", "#1A202C");
      document.documentElement.style.setProperty("--body-color", "#FFF");
      document.documentElement.style.setProperty("--link-color", "#FFC400");
      document.documentElement.style.setProperty(
        "--link-visited-color",
        "#C27DC0"
      );
}

export function setLightMode() {
  document.documentElement.style.setProperty("--body-bg-color", "#FFF");
      document.documentElement.style.setProperty("--body-color", "#000");
      document.documentElement.style.setProperty("--link-color", "#00E");
      document.documentElement.style.setProperty(
        "--link-visited-color",
        "#551A8B"
      );
}
