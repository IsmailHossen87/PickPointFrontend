import image from "../assets/images/travel-register.jpg"
import Logo from "@/assets/icons/Logo"
import { RegisterForm } from "@/components/models/Authentication/RegisterForm"
import { Link } from "react-router"

export default function RegisterPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* left */}
            <div className="bg-muted relative hidden lg:block">
                <img
                    src={image}
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-75 dark:grayscale"
                />
            </div>

            {/* Right side */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link to={"/"}>
                        <Logo />
                        </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegisterForm />
                    </div>
                </div>

            </div>
        </div>
    )
}
