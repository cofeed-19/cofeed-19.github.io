import { getSiteFeeds, insertSiteFeed } from "../services/indexeddbService";
import { SiteFeed, TransferData, TransferFeed } from "../models";
import { databaseVersion } from "../constants";
import { compress, decompress } from "./compressService";
import { siteDomain } from "../constants";

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
      insertSiteFeed(refactorExportToFeed(feed))
    );
    console.log("Database updated successfully");
    window.location.reload();
  } else {
    alert("Feed is empty");
  }
}

export async function importFeedFromFile(jsonFromFile: string) {
  const transferData = JSON.parse(jsonFromFile) as TransferData;

  if (transferData.feed) {
    transferData.feed.forEach((feed) =>
      insertSiteFeed(refactorExportToFeed(feed))
    );
    console.log("Database updated successfully");
    window.location.reload();
  } else {
    alert("Feed is empty");
  }
}

function refactorExportToFeed(feed: TransferFeed): SiteFeed {
  const { domain } = feed;
  const url = domain + feed.url;

  const visited = (feed.visited ?? []).reduce((acc, path) => {
    return { ...acc, [domain + path]: true };
  }, {});

  return { url, visited, favorite: feed.favorite ?? false };
}

function refactorFeedToExport(feed: SiteFeed): TransferFeed {
  const { url, favorite } = feed;

  let domain: string = "";
  let urlPath: string = "";

  // // regex pattern to extract domain extensions as "com", "md", "org"
  const pattern = /(?<=\.).*?(?=\/)/;
  const domainExtension = pattern.exec(url)?.[0];

  if (domainExtension) {
    const [feedDomain, path] = url.split(`${domainExtension}/`);
    domain = `${feedDomain}${domainExtension}/`;
    urlPath = path;
  } else {
    domain = `${url}/`;
  }

  const visited: string[] = Object.keys(feed.visited ?? {}).map((path) =>
    path.replace(domain, "")
  );

  return { domain, url: urlPath, visited, favorite };
}
