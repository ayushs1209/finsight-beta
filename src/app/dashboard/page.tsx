import Dashboard from '@/components/dashboard/dashboard';
import ProtectedRoute from '@/components/auth/protected-route';
import { Toaster } from '@/components/ui/toaster';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
      <Toaster />
    </ProtectedRoute>
  );
}
