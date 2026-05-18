
import { getCurrentUserInfo } from "../../../lib/user"

import { AuthProvider } from "@/context/AuthContext";
import AdminNavBar from "@/components/admin/AdminNavBar"

export default async function WithNavigation({ children }: { children: React.ReactNode }) {

    const user = await getCurrentUserInfo();
    console.log('current user: ', user)

    return (
        <AuthProvider user={user} >
            <div className="w-full min-h-screen">
                <AdminNavBar />
                <main>{children}</main>
            </div>
        </AuthProvider>
    )   
}