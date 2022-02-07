import { UserFeed, AddedSite, SiteFeed } from "../models";

export const FeedManager = () => {

    function feedConverter(feed: SiteFeed[], sites: AddedSite[]) {

        let userFeeds: UserFeed[] = [];

        sites.map(sitesLink => {
            let userFeed: UserFeed = {AddedSite: {Url: sitesLink.Url, Author: sitesLink.Author, Title: sitesLink.Title}, SiteFeed: []}
            feed.map(visitedLink => {
                if(visitedLink.AddedSiteRef == sitesLink.ID){
                    userFeed.SiteFeed?.push({Url: visitedLink.Url, IsVisited: visitedLink.IsVisited, Title: visitedLink.Title})
                }
            })
            userFeeds.push(userFeed);
        })

        return userFeeds;
    }
    return {
        feedConverter
    }
}