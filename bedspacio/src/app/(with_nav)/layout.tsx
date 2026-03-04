import Footer from "@/components/Footer"
import NavigationBar from "@/components/navigationBar"

export default function WithNavigation({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-w-[400px]">
            <NavigationBar />
            <main>{children}</main>
            <Footer />
        </div>
    )   
}