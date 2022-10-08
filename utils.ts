import favecon from "favecon";

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

export async function getFavicon(link?: string): Promise<string | undefined> {
  const feedFavicon =
    (link && (await favecon.getBestIcons(link))[0]?.href) ??
    (await fetch(`${link}/favicon.ico`, { method: "HEAD" }).then((res) =>
      res.ok ? `${link}/favicon.ico` : undefined
    ));

  return feedFavicon;
}
