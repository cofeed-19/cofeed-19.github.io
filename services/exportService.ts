import { getSiteFeeds, insertSiteFeed } from "../services/indexeddbService";
import { Feed, SiteFeed, TransferData, TransferFeed } from "../models";
import { databaseVersion } from "../constants";
import { compress, decompress } from "./compressService";
import { siteDomain } from "../constants";
import RSSParser from "rss-parser";

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

export async function exportFeed(): Promise<string | undefined> {
  const feed = (await getSiteFeeds()).map((feed) => refactorFeedToExport(feed));

  const transferData: TransferData = {
    db: databaseVersion,
    feed,
  };

  download(
    new Date().toLocaleDateString("uk-en") + "-cofeed.json",
    JSON.stringify(transferData, undefined, 2)
  );

  const compressedData: string = compress(JSON.stringify(transferData));
  const linkToExport = siteDomain + compressedData;

  return linkToExport;
}

export async function importFeed(link: string) {
  const transferString = decompress(link.replace(siteDomain, ""));

  const transferData = JSON.parse(transferString) as TransferData;

  if (transferData.feed) {
    transferData.feed.forEach((feed) =>
      insertSiteFeed(refactorExportToFeed(feed) as Feed)
    );
    console.log("Database updated successfully");
    window.location.reload();
  } else {
    alert("Feed is empty");
  }
}

export async function importFeedFromFile(jsonFromFile: string) {
  const transferData = JSON.parse(jsonFromFile) as TransferData;
  const rssParser = new RSSParser();
  const errors : string[] = [];

  if (transferData.feed) {
    for await (const feed of transferData.feed) {
      try {
        const parsedFeed = await rssParser.parseURL(feed.url);
        if (parsedFeed) {
          insertSiteFeed(refactorExportToFeed(feed) as Feed);
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
    console.log("Database updated successfully");
    window.location.reload();
  } else {
    alert("Feed is empty");
  }
}

function refactorExportToFeed(feed: TransferFeed): Feed {
  const { domain, priority } = feed;
  const url = feed.url;

  const visited =
    feed.visited?.reduce<Record<string, boolean>>((acc, path) => {
      const link = domain + path;

      acc[feed.url] = true;

      return acc;
    }, {}) || {};
  return { url, visited, priority, items: [] };
}

function refactorFeedToExport(feed: Feed): TransferFeed {
  const { url, priority } = feed;

  let domain: string = "";
  let urlPath: string = "";

  // regex pattern to extract domain extensions as "com", "md", "org"
  const pattern = /(?<=\.).*?(?=\/)/;
  const domainExtension = pattern.exec(feed.url)?.[0];

  if (domainExtension) {
    const [feedDomain, path] = url.split(`.${domainExtension}/`);
    domain = `${feedDomain}${domainExtension}/`;
    urlPath = path;
  } else {
    domain = `${url}/`;
  }

  const visited: string[] = Object.keys(feed.visited ?? {}).map((path) =>
    path.replace(domain, "")
  );

  return { domain, url: feed.url, visited, priority, items: [] };
}
