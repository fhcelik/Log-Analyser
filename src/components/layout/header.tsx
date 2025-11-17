
'use client';
import Link from 'next/link';
import {BarChart3} from 'lucide-react';
import {ThemeToggle} from '@/components/theme-toggle';
import {Button} from '@/components/ui/button';
import {usePathname} from 'next/navigation';
import {cn} from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const isAnalyzerPage = pathname === '/analyzer';

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-card shadow-sm border-b">
      <Link
        href="/"
        className="flex items-center justify-center gap-2"
        aria-label="ETL Insights Analyzer Home"
      >
        <BarChart3 className="h-6 w-6 text-primary" />
        <span className="font-semibold hidden sm:inline-block">
          ETL Insights Analyzer
        </span>
      </Link>
      <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
        <Button variant="ghost" asChild>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/"
          >
            Home
          </Link>
        </Button>
        <Button asChild disabled={isAnalyzerPage}>
          <Link href="/analyzer">Analyze Logs</Link>
        </Button>
        <ThemeToggle />
      </nav>
    </header>
  );
}
