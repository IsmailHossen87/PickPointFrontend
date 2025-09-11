import type { ReactNode } from "react"
import Footer from "./Footer"
import Navbar from "./Navbar"

interface IProps {
    children: ReactNode
}
export default function CommonLayout({ children }: IProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50">
                <Navbar />
            </header>

            <main className="grow-1">
                {children}
            </main>

            <footer className="mt-auto">
                <Footer />
            </footer>
        </div>
    )
}
