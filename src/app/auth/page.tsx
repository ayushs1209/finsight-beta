import AuthForm from '@/components/auth/auth-form';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
