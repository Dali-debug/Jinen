import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Baby } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <Baby className="w-16 h-16 text-purple-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
