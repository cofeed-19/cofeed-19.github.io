import RSSParser from "rss-parser";
import { databaseVersion } from "../constants";
import { Feed, TransferData, TransferFeed } from "../models";
import { getSiteFeeds, insertSiteFeed } from "../services/indexeddbService";
import { addFavorites, getFavorites } from "./favoritesService";

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export async function exportData() {
  const feed = (await getSiteFeeds()).map((feed) => convertToTransferFeed(feed));
  const favorites = await getFavorites();

  const transferData: TransferData = {
    db: databaseVersion,
    feed,
    favorites,
  };

  download(
    new Date().toLocaleDateString("uk-en") + "-cofeed.json",
    JSON.stringify(transferData, undefined, 2)
  );
  localStorage.setItem("cofeed_last_export_date", Date.now().toString());
}

export async function importDataFromFile(jsonFromFile: string) {
  const transferData = JSON.parse(jsonFromFile) as TransferData;
  const rssParser = new RSSParser();
  const errors: string[] = [];

  if (transferData.feed) {
    for await (const feed of transferData.feed) {
      try {
        const parsedFeed = await rssParser.parseURL(feed.url);
        if (parsedFeed) {
          insertSiteFeed(convertToFeed(feed) as Feed);
        }
      } catch (e) {
        errors.push(feed.url);
        console.error(`Could not update feed for ${feed.url} ${e}`);
      }
    }

    if (errors.length) {
      alert(
        `Could not add:\n${errors.join(
          "\n"
        )}\n\nProbable CORS issue😢!\nMaybe ask website owner to enable CORS🤔!\nOr install browser extension to allow CORS: https://mybrowseraddon.com/access-control-allow-origin.html`
      );
    }
  }

  if (transferData.favorites) {
    await addFavorites(transferData.favorites);
  }

  console.log("Database updated successfully");
  window.location.reload();
}

function convertToFeed(feed: TransferFeed): Feed {
  const { priority, domain } = feed;
  // Handle old format where url is relative (e.g., "feed.xml")
  const url = feed.url.startsWith("http") ? feed.url : (domain || "") + feed.url;

  const visited =
    feed.visited?.reduce<Record<string, boolean>>((acc, link) => {
      const trimmedLink = link.trim();
      // Handle both full URLs and relative paths (old format)
      const fullLink = trimmedLink.startsWith("http")
        ? trimmedLink
        : (domain || "") + trimmedLink;
      acc[fullLink] = true;
      return acc;
    }, {}) || {};
  return { url, visited, priority, items: [] };
}

function convertToTransferFeed(feed: Feed): TransferFeed {
  const { url, priority } = feed;
  const visited: string[] = Object.keys(feed.visited ?? {});

  return { url, visited, priority, items: [] };
}
