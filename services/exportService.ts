import { getSiteFeeds, insertSiteFeed } from "../services/indexeddbService";
import { SiteFeed, TransferData, TransferFeed } from "../models";
import { databaseVersion } from "../constants";
import { compress, decompress } from "./compressService";
import { siteDomain } from "../constants";

export async function exportFeed(): Promise<string | undefined> {
  let transferFeed: TransferFeed[] = [];
  const feedStore = (await getSiteFeeds()) as SiteFeed[];
  feedStore.forEach((feed) => transferFeed.push(refactorFeedToExport(feed)));

  const transferData: TransferData = {
    db: databaseVersion,
    feed: transferFeed,
  };

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

function refactorExportToFeed(feed: TransferFeed): SiteFeed {
  const url = feed.domain + feed.url;

  const visited =
    feed.visited?.reduce<Record<string, boolean>>((acc, path) => {
      acc[feed.domain + path] = true;
      return acc;
    }, {}) || {};
  return { url: url, visited: visited };
}

function refactorFeedToExport(feed: SiteFeed): TransferFeed {
  let domain: string = "";
  let urlPath: string = "";
  let visited: string[] = [];

  // regex pattern to extract domain extensions as "com", "md", "org"
  const pattern = /(?<=\.).*?(?=\/)/;

  const domainExtension = pattern.exec(feed.url);

  if (domainExtension) {
    var splittedUrl = feed.url.split(domainExtension[0] + "/");
    domain = splittedUrl[0] + domainExtension[0] + "/";
    urlPath = splittedUrl[1];
  } else {
    domain = feed.url + "/";
  }

  for (let link in feed.visited) {
    visited.push(link.replace(domain, ""));
  }

  return { domain: domain, url: urlPath, visited: visited };
}
