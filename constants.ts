export const STORAGE_PREFIX = "FWF_";

export const databaseName = 'FeedDb';
export const databaseVersion = 1;

export enum AddedSiteParams{
    Name = "SiteUrls",
    Url = "Url",
    Author = "Author",
    Title = "Title"
}

export enum SiteFeedParams{
    Name = "VisitedUrls",
    AddedSiteRef = "AddedSiteRef",
    Url = "Url",
    IsVisited = "IsVisited",
    Title = "Title"
}
