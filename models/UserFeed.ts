import { AddedSite, SiteFeed } from ".";

export interface UserFeed {
    AddedSite: AddedSite;
    SiteFeed?: SiteFeed[];
}