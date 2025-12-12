import Link from "next/link";

export default function Footer() {
    return (
        <footer className="fixed bottom-0 w-full py-4 bg-[#FAFAFA]">
            <div className="container mx-auto flex justify-center items-center">
                <p className="font-serif text-xs text-muted-foreground/50 tracking-widest uppercase">
                    Made by <Link href="https://github.com/zacurrya" className="font-bold border-b border-muted-foreground/50 pb-0.5 text-muted-foreground/50">Zacurrya</Link>
                </p>
            </div>
        </footer>
    );
}
