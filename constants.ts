export const STORAGE_PREFIX = "FWF_";

export const databaseName = 'FeedDb';
export const databaseVersion = 1;

export enum TableNames{
    SiteUrls = "SiteUrls",
    VisitedUrls = "VisitedUrls"
}

export enum SiteUrlsFields{
    Url = "Url"
}

export enum VisitedUrlsFields{
    SiteUrlRef = "SiteUrlRef",
    FeedUrl = "FeedUrl"
}