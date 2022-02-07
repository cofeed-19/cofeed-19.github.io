import { UserFeed, AddedSite, SiteFeed } from "../models";

export const FeedManager = () => {

    function feedConverter(visitedLinks: SiteFeed[], sitesLinks: AddedSite[]) {

        let userFeeds: UserFeed[] = [];

        sitesLinks.map(sitesLink => {
            let userFeed: UserFeed = {AddedSiteUrl: sitesLink.Url, SiteFeed: []}
            visitedLinks.map(visitedLink => {
                if(visitedLink.AddedSiteRef == sitesLink.ID){
                    userFeed.SiteFeed?.push({Url: visitedLink.Url, IsVisited: visitedLink.IsVisited})
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