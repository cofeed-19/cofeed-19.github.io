import { UserFeed, SiteUrl, VisitedUrl } from "../models";

export const FeedManager = () => {

    function feedConverter(visitedLinks: VisitedUrl[], sitesLinks: SiteUrl[]) {

        let userFeeds: UserFeed[] = [];

        sitesLinks.map(sitesLink => {
            let userFeed: UserFeed = {SiteUrl: sitesLink.Url, Visited: []}
            visitedLinks.map(visitedLink => {
                if(visitedLink.SiteUrlRef == sitesLink.ID){
                    userFeed.Visited?.push(visitedLink.FeedUrl)
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