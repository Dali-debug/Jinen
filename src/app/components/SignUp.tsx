import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { authService } from '../lib/auth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Baby, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'parent' | 'nursery'>('parent');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.signUp(email, password, name, userType);
      
      // Sign in after successful sign up
      const { session } = await authService.signIn(email, password);
      
      if (session) {
        toast.success('Account created successfully!');
        
        if (userType === 'nursery') {
          navigate('/nursery/dashboard');
        } else {
          navigate('/parent/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join Jinen to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup value={userType} onValueChange={(value) => setUserType(value as 'parent' | 'nursery')}>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="parent" id="parent" />
                  <Label htmlFor="parent" className="cursor-pointer flex-1">
                    <div className="font-semibold">Parent</div>
                    <div className="text-sm text-gray-600">Looking for nursery care</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="nursery" id="nursery" />
                  <Label htmlFor="nursery" className="cursor-pointer flex-1">
                    <div className="font-semibold">Nursery Owner</div>
                    <div className="text-sm text-gray-600">Offering nursery services</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-purple-600 hover:underline font-semibold">
              Sign in
            </Link>
          </div>
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
