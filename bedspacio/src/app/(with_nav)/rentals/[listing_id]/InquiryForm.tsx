
import InquiryFormClient from "./InquiryFormClient"
import { InquiryFormValues } from "./InquiryFormClient"

type PropertyManagerInfo = {
    slot:number,
    propertyManager: string,
    propertyManagerContact: string,
    profileImage: string,
    publicRoomId: string,
    startingPrice: string
}

export default async function InquiryForm ({ 
    slot,
    propertyManager, 
    propertyManagerContact, 
    profileImage,
    publicRoomId,
    startingPrice
}: PropertyManagerInfo) {

    // const createRecord = await setLeadRecord()

    return (
        <>
            <InquiryFormClient 
                slot={slot}
                propertyManager={propertyManager}
                propertyManagerContact={propertyManagerContact}
                profileImage={profileImage}
                public_room_id={publicRoomId}
                startingPrice={startingPrice}
            />
        </>
    )
}