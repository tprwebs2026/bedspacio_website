import Footer from "@/components/Footer"
import NonNavigationBar from "@/components/navigationNoLink"

export default function NoNavigation({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full">
            <NonNavigationBar />
            <main>{children}</main>
            <Footer />
        </div>
    )   
}