"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DollarSign,
  UploadCloud,
  BarChart,
  Filter,
  Download,
  Github,
  Book,
  LifeBuoy,
  Twitter,
  Linkedin,
  Menu,
} from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import ParticlesBackground from '../dashboard/particles-background';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import Image from 'next/image';


const features = [
  {
    icon: <UploadCloud className="w-10 h-10 text-primary" />,
    title: 'Upload CSVs',
    description: 'Easily upload your payout data in CSV format with our intuitive interface.',
  },
  {
    icon: <BarChart className="w-10 h-10 text-primary" />,
    title: 'Smart Visualizations',
    description: 'Get instant insights with beautiful, interactive charts and graphs.',
  },
  {
    icon: <Filter className="w-10 h-10 text-primary" />,
    title: 'Powerful Filtering',
    description: 'Drill down into your data with robust filtering and search capabilities.',
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    title: 'Secure Export',
    description: 'Export your filtered data back to a CSV file securely and quickly.',
  },
];

const testimonials = [
  {
    name: 'Alex Johnson',
    title: 'CFO, TechSolutions',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: "FinSight has completely revolutionized how we handle our payout analysis. It's fast, intuitive, and incredibly powerful. A must-have tool for any finance team.",
  },
  {
    name: 'Samantha Bee',
    title: 'Payroll Manager, GigWorks',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    text: 'The ability to just upload a CSV and get instant, beautiful visualizations is a game-changer. It saves us hours of manual work every week.',
  },
];

const footerLinks = [
  {
    title: 'Product',
    links: [
      { text: 'Features', href: '#features' },
      { text: 'Pricing', href: '#' },
      { text: 'Documentation', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { text: 'About Us', href: '#' },
      { text: 'Careers', href: '#' },
      { text: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { text: 'Privacy Policy', href: '#' },
      { text: 'Terms of Service', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: <Github />, href: '#' },
  { icon: <Twitter />, href: '#' },
  { icon: <Linkedin />, href: '#' },
];

export default function LandingPage() {
    const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ParticlesBackground />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <DollarSign className="h-7 w-7 text-primary" />
              <span>FinSight</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
            <Link href="#" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/auth">Sign In</Link>
            </Button>
            <Button asChild>
                <Link href="/auth">Get Started</Link>
            </Button>
            <ThemeToggle />
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                      <Menu />
                  </Button>
              </SheetTrigger>
              <SheetContent side="right">
                  <div className="flex flex-col space-y-6 p-4">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={() => setMenuOpen(false)}>
                        <DollarSign className="h-7 w-7 text-primary" />
                        <span>FinSight</span>
                    </Link>
                    <nav className="flex flex-col space-y-4 text-lg">
                        <Link href="#features" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#testimonials" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Testimonials</Link>
                        <Link href="#" onClick={() => setMenuOpen(false)} className="hover:text-primary transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex flex-col space-y-2">
                        <Button variant="outline" asChild><Link href="/auth">Sign In</Link></Button>
                        <Button asChild><Link href="/auth">Get Started</Link></Button>
                    </div>
                    <div className="pt-4">
                        <ThemeToggle />
                    </div>
                  </div>
              </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                Advanced Payment Solution
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                Seamless Payments, Instant Payouts
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Automated payroll, effortless banking, and smooth onboarding. Visualize your financial data with unprecedented ease and clarity.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/auth">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
             <div className="mt-16">
                 <Image 
                    src="https://placehold.co/1200x600.png" 
                    alt="FinSight Dashboard Screenshot"
                    data-ai-hint="dashboard fintech"
                    width={1200}
                    height={600}
                    className="rounded-lg shadow-2xl border border-border"
                 />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Why FinSight?</h2>
              <p className="text-muted-foreground mt-4">
                Everything you need to manage and understand your financial payouts, all in one place.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Trusted by Finance Teams</h2>
              <p className="text-muted-foreground mt-4">
                See what our users have to say about their experience with FinSight.
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <p className="mb-4 text-muted-foreground">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border z-10">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-2">
                    <DollarSign className="h-7 w-7 text-primary" />
                    <span>FinSight</span>
                </Link>
                <p className="text-muted-foreground text-sm">Automated payroll, effortless banking.</p>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.text}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FinSight. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              {socialLinks.map((link, index) => (
                <Link href={link.href} key={index} className="text-muted-foreground hover:text-primary transition-colors">
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
