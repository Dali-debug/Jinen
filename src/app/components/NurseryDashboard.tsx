import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { authService } from '../lib/auth';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Baby, LogOut, User, Plus, Users, DollarSign, Calendar, Settings, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function NurseryDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [nursery, setNursery] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Nursery form
  const [showNurseryForm, setShowNurseryForm] = useState(false);
  const [nurseryName, setNurseryName] = useState('');
  const [nurseryLocation, setNurseryLocation] = useState('');
  const [nurseryDescription, setNurseryDescription] = useState('');
  const [nurseryPrice, setNurseryPrice] = useState('');
  const [nurseryPlaces, setNurseryPlaces] = useState('');
  const [nurseryPhone, setNurseryPhone] = useState('');
  const [nurseryEmail, setNurseryEmail] = useState('');

  // Program form
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [programSchedule, setProgramSchedule] = useState('');
  const [programActivities, setProgramActivities] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const profileData = await api.getProfile();
      setProfile(profileData.profile);

      if (profileData.profile?.nursery) {
        const nurseryData = profileData.profile.nursery;
        setNursery(nurseryData);

        // Load children and payments for this nursery
        const [childrenData, paymentsData, programData] = await Promise.all([
          api.getNurseryChildren(nurseryData.id),
          api.getNurseryPayments(nurseryData.id),
          api.getProgram(nurseryData.id).catch(() => ({ program: null })),
        ]);

        setChildren(childrenData.children || []);
        setPayments(paymentsData.payments || []);
        setProgram(programData.program);

        // Populate form with existing data
        setNurseryName(nurseryData.name || '');
        setNurseryLocation(nurseryData.location || '');
        setNurseryDescription(nurseryData.description || '');
        setNurseryPrice(nurseryData.price?.toString() || '');
        setNurseryPlaces(nurseryData.availablePlaces?.toString() || '');
        setNurseryPhone(nurseryData.phone || '');
        setNurseryEmail(nurseryData.email || '');

        if (programData.program) {
          setProgramSchedule(programData.program.schedule || '');
          setProgramActivities(programData.program.activities || '');
        }
      }
    } catch (error: any) {
      console.error('Load dashboard error:', error);
      if (error.message.includes('Unauthorized')) {
        navigate('/login');
      } else {
        toast.error('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdateNursery = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const nurseryData = {
        name: nurseryName,
        location: nurseryLocation,
        description: nurseryDescription,
        price: Number(nurseryPrice),
        availablePlaces: Number(nurseryPlaces),
        phone: nurseryPhone,
        email: nurseryEmail,
      };

      if (nursery) {
        await api.updateNursery(nursery.id, nurseryData);
        toast.success('Nursery updated successfully');
      } else {
        await api.createNursery(nurseryData);
        toast.success('Nursery created successfully');
      }

      setShowNurseryForm(false);
      await loadDashboard();
    } catch (error) {
      console.error('Save nursery error:', error);
      toast.error('Failed to save nursery');
    }
  };

  const handleUpdateProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nursery) return;

    try {
      await api.updateProgram(nursery.id, {
        schedule: programSchedule,
        activities: programActivities,
      });

      toast.success('Program updated successfully');
      setShowProgramForm(false);
      await loadDashboard();
    } catch (error) {
      console.error('Update program error:', error);
      toast.error('Failed to update program');
    }
  };

  const handleUpdateChildStatus = async (childId: string, status: string) => {
    try {
      await api.updateChildStatus(childId, status);
      toast.success('Child status updated');
      await loadDashboard();
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
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
        <Baby className="w-12 h-12 text-purple-600 animate-pulse" />
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Nursery Dashboard</h2>
            <p className="text-gray-600">Manage your nursery and enrollments</p>
          </div>
          <Dialog open={showNurseryForm} onOpenChange={setShowNurseryForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                {nursery ? <Settings className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {nursery ? 'Edit Nursery' : 'Create Nursery'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{nursery ? 'Edit Nursery' : 'Create Nursery'}</DialogTitle>
                <DialogDescription>
                  {nursery ? 'Update your nursery information' : 'Set up your nursery profile'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrUpdateNursery} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nursery Name *</Label>
                    <Input
                      id="name"
                      value={nurseryName}
                      onChange={(e) => setNurseryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={nurseryLocation}
                      onChange={(e) => setNurseryLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={nurseryDescription}
                    onChange={(e) => setNurseryDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Monthly Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={nurseryPrice}
                      onChange={(e) => setNurseryPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="places">Available Places *</Label>
                    <Input
                      id="places"
                      type="number"
                      value={nurseryPlaces}
                      onChange={(e) => setNurseryPlaces(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={nurseryPhone}
                      onChange={(e) => setNurseryPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={nurseryEmail}
                      onChange={(e) => setNurseryEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  {nursery ? 'Update Nursery' : 'Create Nursery'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {!nursery ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Baby className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Create Your Nursery Profile</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your nursery profile to accept enrollments
              </p>
              <Button
                onClick={() => setShowNurseryForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Nursery
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Children</p>
                      <p className="text-2xl font-bold">{children.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold">
                        {children.filter((c) => c.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Approved</p>
                      <p className="text-2xl font-bold">
                        {children.filter((c) => c.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Payments</p>
                      <p className="text-2xl font-bold">{payments.length}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="children" className="space-y-4">
              <TabsList>
                <TabsTrigger value="children">Enrolled Children</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="program">Program</TabsTrigger>
              </TabsList>

              <TabsContent value="children">
                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Children</CardTitle>
                    <CardDescription>Manage child enrollments and approvals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {children.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No children enrolled yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Child Name</TableHead>
                            <TableHead>Age</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {children.map((child) => (
                            <TableRow key={child.id}>
                              <TableCell className="font-medium">{child.name}</TableCell>
                              <TableCell>{child.age}</TableCell>
                              <TableCell>{child.parentInfo?.name || 'N/A'}</TableCell>
                              <TableCell>
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
                              </TableCell>
                              <TableCell>
                                {child.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleUpdateChildStatus(child.id, 'approved')}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleUpdateChildStatus(child.id, 'rejected')}
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>View all payments from parents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <div className="text-center py-8">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No payments received yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{payment.parentInfo?.name || 'N/A'}</TableCell>
                              <TableCell className="font-medium">${payment.amount}</TableCell>
                              <TableCell>
                                <Badge>{payment.status}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="program">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Daily Program</CardTitle>
                        <CardDescription>Share your daily schedule and activities</CardDescription>
                      </div>
                      <Dialog open={showProgramForm} onOpenChange={setShowProgramForm}>
                        <DialogTrigger asChild>
                          <Button>
                            <Calendar className="w-4 h-4 mr-2" />
                            {program ? 'Update Program' : 'Create Program'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Update Daily Program</DialogTitle>
                            <DialogDescription>
                              Set the daily schedule and activities for parents to see
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateProgram} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="schedule">Daily Schedule</Label>
                              <Textarea
                                id="schedule"
                                value={programSchedule}
                                onChange={(e) => setProgramSchedule(e.target.value)}
                                rows={8}
                                placeholder="8:00 AM - Arrival & Free Play&#10;9:00 AM - Snack Time&#10;9:30 AM - Learning Activities&#10;..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="activities">Activities</Label>
                              <Textarea
                                id="activities"
                                value={programActivities}
                                onChange={(e) => setProgramActivities(e.target.value)}
                                rows={8}
                                placeholder="• Arts and crafts&#10;• Music and movement&#10;• Outdoor play&#10;..."
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                              Save Program
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {program ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Daily Schedule</h4>
                          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                            {program.schedule || 'No schedule set'}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Activities</h4>
                          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                            {program.activities || 'No activities listed'}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last updated: {new Date(program.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No program created yet</p>
                        <Button onClick={() => setShowProgramForm(true)}>Create Program</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
