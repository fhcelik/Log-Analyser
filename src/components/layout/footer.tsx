import Link from 'next/link';

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
      <p className="text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} ETL Insights Analyzer. All rights
        reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="#"
          aria-label="Terms of Service"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs hover:underline underline-offset-4"
          href="#"
          aria-label="Privacy Policy"
        >
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
