import RSSParser from "rss-parser";
import { databaseVersion, siteDomain } from "../constants";
import { Feed, TransferData, TransferFeed } from "../models";
import { getSiteFeeds, insertSiteFeed } from "../services/indexeddbService";
import { compress, decompress } from "./compressService";
import { addFavorites, getFavorites } from "./favoritesService";

function download(filename: string, text: string) {
  var element = document.createElement("a");
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

export async function exportData(): Promise<string | undefined> {
  const feed = (await getSiteFeeds()).map((feed) => refactorFeedToExport(feed));
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

  const compressedData: string = compress(JSON.stringify(transferData));
  const linkToExport = siteDomain + compressedData;

  return linkToExport;
}

export async function importData(link: string) {
  const transferString = decompress(link.replace(siteDomain, ""));
  const transferData = JSON.parse(transferString) as TransferData;

  if (transferData.feed) {
    transferData.feed.forEach((feed) =>
      insertSiteFeed(convertToFeed(feed) as Feed)
    );
  }

  if (transferData.favorites) {
    await addFavorites(transferData.favorites);
  }

  console.log("Database updated successfully");
  window.location.reload();
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
  const { priority } = feed;
  const url = feed.url;

  const visited =
    feed.visited?.reduce<Record<string, boolean>>((acc, visitedPath) => {
      acc[feed.domain + visitedPath] = true;
      return acc;
    }, {}) || {};
  return { url, visited, priority, items: [] };
}

function refactorFeedToExport(feed: Feed): TransferFeed {
  const { url, priority } = feed;

  let domain: string = "";

  // regex pattern to extract domain extensions as "com", "md", "org"
  const pattern = /(?<=\.).*?(?=\/)/;
  const domainExtension = pattern.exec(feed.url)?.[0];

  if (domainExtension) {
    const [feedDomain] = url.split(`.${domainExtension}/`);
    domain = `${feedDomain}${domainExtension}/`;
  } else {
    domain = `${url}/`;
  }

  const visited: string[] = Object.keys(feed.visited ?? {}).map((path) =>
    path.replace(domain, "")
  );

  return { domain, url: feed.url, visited, priority, items: [] };
}
