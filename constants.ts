export const STORAGE_PREFIX = "FWF_";

export const databaseName = 'FeedDb';
export const databaseVersion = 1;

export enum AddedSiteParams{
    Name = "SiteUrls",
    Url = "Url",
    Author = "Author"
}

export enum SiteFeedParams{
    Name = "VisitedUrls",
    AddedSiteRef = "SiteUrlRef",
    Url = "FeedUrl",
    IsVisited = "IsVisited",
    Title = "Title"
}