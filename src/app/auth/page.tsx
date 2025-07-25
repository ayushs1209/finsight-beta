import AuthForm from '@/components/auth/auth-form';
import ParticlesBackground from '@/components/dashboard/particles-background';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <ParticlesBackground />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md z-10">
        <AuthForm />
      </div>
    </div>
  );
}
