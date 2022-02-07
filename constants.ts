export const STORAGE_PREFIX = "FWF_";

export const databaseName = 'FeedDb';
export const databaseVersion = 1;

export enum AddedSiteParams{
    Name = "SiteUrls",
    Url = "Url"
}

export enum SiteFeedParams{
    Name = "VisitedUrls",
    AddedSiteRef = "SiteUrlRef",
    Url = "FeedUrl",
    IsVisited = "IsVisited"
}