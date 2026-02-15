import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { authService } from '../lib/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Baby, LogOut, Search, CreditCard, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [profileData, childrenData, paymentsData] = await Promise.all([
        api.getProfile(),
        api.getParentChildren(),
        api.getParentPayments(),
      ]);

      setProfile(profileData.profile);
      setChildren(childrenData.children);
      setPayments(paymentsData.payments);
    } catch (error: any) {
      console.error('Load dashboard error:', error);
      toast.error('Failed to load dashboard');
      // If unauthorized, redirect to login
      if (error.message.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Baby className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Jinen
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="font-medium">{profile?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h2>
          <p className="text-gray-600">Manage your children's nursery care</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/nurseries')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Browse Nurseries</h3>
                      <p className="text-sm text-gray-600">Find the perfect nursery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/nurseries')}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Find Nearby</h3>
                      <p className="text-sm text-gray-600">Nurseries near you</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registered Children */}
            <Card>
              <CardHeader>
                <CardTitle>My Children</CardTitle>
                <CardDescription>View and manage your children's enrollments</CardDescription>
              </CardHeader>
              <CardContent>
                {children.length === 0 ? (
                  <div className="text-center py-8">
                    <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No children registered yet</p>
                    <Button onClick={() => navigate('/nurseries')}>Browse Nurseries</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/children/${child.id}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{child.name}</h4>
                            <p className="text-sm text-gray-600">Age: {child.age}</p>
                            <p className="text-sm text-gray-600">Nursery ID: {child.nurseryId}</p>
                          </div>
                          <Badge
                            variant={
                              child.status === 'approved'
                                ? 'default'
                                : child.status === 'pending'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {child.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-4">No payments yet</p>
                ) : (
                  <div className="space-y-3">
                    {payments.slice(0, 5).map((payment) => (
                      <div key={payment.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium">${payment.amount}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Enrolled Children</p>
                  <p className="text-2xl font-bold">{children.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Payments</p>
                  <p className="text-2xl font-bold">{payments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold">
                    {children.filter((c) => c.status === 'pending').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
