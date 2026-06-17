import ContentPageWrapper from "./ContentPageWrapper";

import { 
    getHomePageBanner, 
    getYoutubeUrl, 
    getRentalsPageBanner, 
    getAboutUsPageBanner,
    getHowItWorksPageBanner
} from "../../../../lib/content";

export default async function Content () {

    const YoutubeURL = await getYoutubeUrl();
    const HomePageBanner = await getHomePageBanner();
    const RentalsPageBanner = await getRentalsPageBanner();
    const AboutUsPageBanner = await getAboutUsPageBanner();
    const HowItWorksBanner = await getHowItWorksPageBanner();

    return <ContentPageWrapper 
        videoDemo={YoutubeURL}
        homePageBanner={HomePageBanner}
        rentalsPageBanner={RentalsPageBanner}
        aboutUsPageBanner={AboutUsPageBanner}
        howItWorksPageBanner={HowItWorksBanner}
    />
}