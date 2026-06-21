import ContentPageWrapper from "./ContentPageWrapper";

import { 
    getHomePageBanner, 
    getYoutubeUrl, 
    getRentalsPageBanner, 
    getAboutUsPageBanner,
    getHowItWorksPageBanner,
    getBedspaceTypeImage,
    getApartmentTypeImage,
    getAboutUsWhoWeAreImage,
    getAboutUsHistoryImage,
    getWhyChooseUsImages,
    getContactImage
} from "../../../../lib/content";

import { redirect } from "next/navigation";
import { getCurrentUser } from "../../../../lib/user"

export default async function Content () {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    if (currentUser.role !== 'admin') {
        redirect('/admin/unauthorized');
    }

    const HomePageBanner = await getHomePageBanner();
    const YoutubeURL = await getYoutubeUrl();
    const BedspaceTypeImage = await getBedspaceTypeImage();
    const ApartmentTypeImage = await getApartmentTypeImage();
    const WhyChooseUsImages = await getWhyChooseUsImages();

    const RentalsPageBanner = await getRentalsPageBanner();

    const AboutUsPageBanner = await getAboutUsPageBanner();
    const WhoWeAreImage = await getAboutUsWhoWeAreImage();
    const HistoryImage = await getAboutUsHistoryImage();

    const HowItWorksBanner = await getHowItWorksPageBanner();

    const ContactImage = await getContactImage();

    return <ContentPageWrapper 
        homePageBanner={HomePageBanner}
        videoDemo={YoutubeURL}
        bedspaceImage={BedspaceTypeImage}
        apartmentImage={ApartmentTypeImage}
        whyChooseUsImage={WhyChooseUsImages}

        rentalsPageBanner={RentalsPageBanner}

        aboutUsPageBanner={AboutUsPageBanner}
        whoWeAreImage={WhoWeAreImage}
        historyImage={HistoryImage}

        howItWorksPageBanner={HowItWorksBanner}

        contactImage={ContactImage}
    />
}