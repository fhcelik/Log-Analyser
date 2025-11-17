import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {UploadCloud, BarChart, Filter, FileDown} from 'lucide-react';
import {PlaceHolderImages} from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const features = [
    {
      icon: <UploadCloud className="h-8 w-8 text-primary" />,
      title: 'Effortless Upload',
      description:
        'Simply drag and drop your CSV or JSON log files to get started instantly.',
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: 'Instant Visualization',
      description:
        'Automatically generate summary cards and charts for key metrics like errors and success rates.',
    },
    {
      icon: <Filter className="h-8 w-8 text-primary" />,
      title: 'Powerful Filtering',
      description:
        'Drill down into your data with filters for date, source system, and status.',
    },
    {
      icon: <FileDown className="h-8 w-8 text-primary" />,
      title: 'Export Insights',
      description:
        'Export your filtered findings to a CSV file for reporting or further analysis.',
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_550px] lg:gap-12 xl:grid-cols-[1fr_650px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Turn Logs into Actionable Insights
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our analyzer tool transforms raw log files into clear, visual
                    dashboards. Instantly diagnose issues, track performance, and
                    optimize your data pipelines.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/analyzer">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Analyze Logs Now
                    </Button>
                  </Link>
                </div>
              </div>
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={650}
                  height={400}
                  className="mx-auto aspect-[16/9] overflow-hidden rounded-xl object-cover sm:w-full"
                />
              )}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-card"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                  Key Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  A Mini-Looker for Diagnostics
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to quickly debug and monitor your jobs,
                  right in your browser. No setup required.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {features.map(feature => (
                <Card key={feature.title} className="h-full">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
