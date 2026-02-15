import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
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
import { Baby, MapPin, DollarSign, Users, Star, ArrowLeft, Calendar, Phone, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NurseryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nursery, setNursery] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  // Registration form
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNurseryDetails();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    try {
      const session = await authService.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const loadNurseryDetails = async () => {
    try {
      if (!id) return;
      
      const [nurseryData, programData] = await Promise.all([
        api.getNursery(id),
        api.getProgram(id).catch(() => ({ program: null })),
      ]);

      setNursery(nurseryData.nursery);
      setProgram(programData.program);
    } catch (error) {
      console.error('Load nursery details error:', error);
      toast.error('Failed to load nursery details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterChild = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to register your child');
      navigate('/login');
      return;
    }

    setSubmitting(true);

    try {
      await api.registerChild({
        name: childName,
        age: childAge,
        nurseryId: id,
        notes,
      });

      toast.success('Child registered successfully! Waiting for nursery approval.');
      setShowRegisterDialog(false);
      setChildName('');
      setChildAge('');
      setNotes('');
    } catch (error: any) {
      console.error('Register child error:', error);
      toast.error(error.message || 'Failed to register child');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Baby className="w-12 h-12 text-purple-600 animate-pulse" />
      </div>
    );
  }

  if (!nursery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nursery not found</p>
          <Button onClick={() => navigate('/nurseries')}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl relative overflow-hidden">
              {nursery.imageUrl ? (
                <img src={nursery.imageUrl} alt={nursery.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Baby className="w-24 h-24 text-white opacity-50" />
                </div>
              )}
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl">{nursery.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <MapPin className="w-4 h-4" />
                      {nursery.location || 'Location not specified'}
                    </CardDescription>
                  </div>
                  {nursery.rating > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {nursery.rating.toFixed(1)} ({nursery.ratingCount} reviews)
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="about">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="program">Program</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  <TabsContent value="about" className="space-y-4 mt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-gray-600">
                        {nursery.description || 'No description available.'}
                      </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <Users className="w-5 h-5 text-purple-600 mb-2" />
                        <p className="text-sm text-gray-600">Available Places</p>
                        <p className="text-2xl font-bold">{nursery.availablePlaces || 0}</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                        <p className="text-sm text-gray-600">Monthly Fee</p>
                        <p className="text-2xl font-bold">${nursery.price || 0}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="program" className="mt-4">
                    {program ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Daily Schedule</h4>
                          <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
                            {program.schedule || 'No schedule available'}
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
                        <p className="text-gray-600">No program information available yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="contact" className="space-y-4 mt-4">
                    {nursery.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{nursery.phone}</p>
                        </div>
                      </div>
                    )}
                    {nursery.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{nursery.email}</p>
                        </div>
                      </div>
                    )}
                    {!nursery.phone && !nursery.email && (
                      <p className="text-gray-600 text-center py-8">No contact information available</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Register Your Child</CardTitle>
                <CardDescription>Enroll your child in this nursery</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Register Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register Your Child</DialogTitle>
                      <DialogDescription>
                        Fill in the details to register your child at {nursery.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegisterChild} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="childName">Child's Name</Label>
                        <Input
                          id="childName"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="childAge">Age</Label>
                        <Input
                          id="childAge"
                          value={childAge}
                          onChange={(e) => setChildAge(e.target.value)}
                          placeholder="e.g., 2 years"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special requirements or information..."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Registration'
                        )}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Fee</span>
                  <span className="font-semibold">${nursery.price || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Places</span>
                  <span className="font-semibold">{nursery.availablePlaces || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {nursery.rating > 0 ? nursery.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
