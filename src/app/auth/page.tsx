import AuthForm from '@/components/auth/auth-form';
import ParticlesBackground from '@/components/dashboard/particles-background';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { DollarSign } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background p-4">
      <ParticlesBackground />
      <header className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <DollarSign className="h-7 w-7 text-primary" />
          <span className="text-foreground">FinSight</span>
        </Link>
        <ThemeToggle />
      </header>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md z-10 mt-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
