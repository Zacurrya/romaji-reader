import Link from 'next/link';

export default function Header() {
    return (
        <header className="absolute top-0 z-50 w-full bg-background">
            <nav className="container mx-auto flex h-16 items-center px-6 justify-center md:justify-start">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="h-4 w-4 rounded-full bg-primary/80 group-hover:scale-110 transition-transform"></span>
                    <span className="text-xl font-serif font-bold tracking-wider text-foreground">
                        Romaji Reader</span>
                </Link>
            </nav>
        </header>
    );
}
