"use client"

import { createContext, useContext } from "react"

type User = {
    id: number,
    fullname: string,
    username: string,
    contact: string,
    email: string,
    role: string,
    is_active: boolean,
    profile_image: string
} | undefined;

interface AuthProviderProp {
    user: User;
    children: React.ReactNode;
}

const AuthContext = createContext<User>(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider = ({
    user,
    children
}: AuthProviderProp) => {
    return (
        <AuthContext.Provider value={ user }>
            { children }
        </AuthContext.Provider>
    )
}