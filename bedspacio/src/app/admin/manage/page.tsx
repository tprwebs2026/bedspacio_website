"use server"

import { getAllUsers } from "../../../../lib/user"
import Manage from "./Manage";
import { ManageType} from "./Manage";

export default async function PageWrapper () {

    const users = await getAllUsers();
    console.log('All users: ', users);

    

    return <Manage users={users} />
}