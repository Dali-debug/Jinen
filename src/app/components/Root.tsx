import { Outlet } from 'react-router';
import { Toaster } from './ui/sonner';

export default function Root() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Outlet />
      <Toaster />
    </div>
  );
}
