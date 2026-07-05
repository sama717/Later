import { Link } from "react-router";
import { Mail } from "lucide-react";
import { SiInstagram, SiX } from "react-icons/si";

const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Explore", path: "/explore" },
    { label: "Library", path: "/library" },
];

function Footer() {
    return (
        <footer className="bg-[#131416] dark:bg-[#0D0E10] px-6 md:px-12 pt-16 pb-8">
            <div className="flex flex-col md:flex-row justify-between gap-12">
                <div className="flex flex-col gap-6">
                    <p className="text-[#F5F6F7] text-lg">Play at your own pace.</p>
                    <div className="flex items-center gap-4">
                        <a href="#" aria-label="Instagram" className="text-[#F5F6F7] hover:text-muted-foreground transition-colors">
                            <SiInstagram size={20} />
                        </a>
                        <a href="#" aria-label="X" className="text-[#F5F6F7] hover:text-muted-foreground transition-colors">
                            <SiX size={20} />
                        </a>
                        <a href="mailto:hello@later.app" aria-label="Email" className="text-[#F5F6F7] hover:text-muted-foreground transition-colors">
                            <Mail size={24} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-50">
                    <span className="text-muted-foreground text-sm">Quick Links</span>
                    {quickLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="font-heading text-[#F5F6F7] hover:text-muted-foreground transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-16">
                <img src="/Logo.svg" alt="LATER Logo" className="h-24 w-auto invert" />
            </div>

            <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
                <a
                    href="https://github.com/sama717/later"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#F5F6F7] transition-colors"
                >
                    https://github.com/sama717/Later
                </a>
                <span>Copyright © 2026 LATER</span>
                <span>Powered by RAWG API</span>
            </div>
        </footer>
    );
}

export default Footer;