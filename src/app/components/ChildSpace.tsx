import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Baby, ArrowLeft, Plus, Calendar, User, DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ChildSpace() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNurseryOwner, setIsNurseryOwner] = useState(false);

  // Update form
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateType, setUpdateType] = useState('general');

  // Payment form
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  useEffect(() => {
    loadChildSpace();
  }, [childId]);

  const loadChildSpace = async () => {
    try {
      if (!childId) return;

      const childKey = childId.startsWith('child:') ? childId : `child:${childId}`;
      
      // Get child details and updates
      const updatesData = await api.getChildUpdates(childKey);
      setUpdates(updatesData.updates || []);

      // Get profile to check if user is nursery owner
      const profileData = await api.getProfile();
      setIsNurseryOwner(profileData.profile?.userType === 'nursery');

      // For demo, we'll show a basic child interface
      // In production, you'd fetch the full child details
    } catch (error) {
      console.error('Load child space error:', error);
      toast.error('Failed to load child information');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!childId) return;

    try {
      const childKey = childId.startsWith('child:') ? childId : `child:${childId}`;
      
      await api.postChildUpdate(childKey, {
        title: updateTitle,
        content: updateContent,
        type: updateType,
      });

      toast.success('Update posted successfully');
      setShowUpdateForm(false);
      setUpdateTitle('');
      setUpdateContent('');
      setUpdateType('general');
      
      await loadChildSpace();
    } catch (error) {
      console.error('Post update error:', error);
      toast.error('Failed to post update');
    }
  };

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayment(true);

    try {
      if (!child?.nurseryId) {
        toast.error('Nursery information not available');
        return;
      }

      await api.createPayment({
        nurseryId: child.nurseryId,
        childId: childId,
        amount: Number(paymentAmount),
        description: paymentDescription,
      });

      toast.success('Payment completed successfully');
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentDescription('');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    } finally {
      setSubmittingPayment(false);
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
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Baby className="w-6 h-6 text-purple-600" />
                      Child Space
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Private updates and communication about your child
                    </CardDescription>
                  </div>
                  {isNurseryOwner && (
                    <Dialog open={showUpdateForm} onOpenChange={setShowUpdateForm}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Post Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Post an Update</DialogTitle>
                          <DialogDescription>
                            Share information about the child's day
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handlePostUpdate} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={updateTitle}
                              onChange={(e) => setUpdateTitle(e.target.value)}
                              placeholder="Today's Activities"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select
                              id="type"
                              value={updateType}
                              onChange={(e) => setUpdateType(e.target.value)}
                              className="w-full px-3 py-2 border rounded-md"
                            >
                              <option value="general">General Update</option>
                              <option value="activity">Activity</option>
                              <option value="meal">Meal</option>
                              <option value="nap">Nap Time</option>
                              <option value="health">Health Note</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                              id="content"
                              value={updateContent}
                              onChange={(e) => setUpdateContent(e.target.value)}
                              rows={6}
                              placeholder="Share details about the child's day..."
                              required
                            />
                          </div>
                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                          >
                            Post Update
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Updates Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Updates & Activities</CardTitle>
                <CardDescription>Recent updates from the nursery</CardDescription>
              </CardHeader>
              <CardContent>
                {updates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No updates yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{update.title}</h4>
                            <Badge variant="outline" className="mt-1">
                              {update.type}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(update.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{update.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            {!isNurseryOwner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
                    <DialogTrigger asChild>
                      <Button className="w-full" variant="outline">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Make Payment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Make a Payment</DialogTitle>
                        <DialogDescription>
                          Process a payment for nursery services
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleMakePayment} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="150.00"
                            required
                            step="0.01"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={paymentDescription}
                            onChange={(e) => setPaymentDescription(e.target.value)}
                            placeholder="Monthly fee - February 2026"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                          disabled={submittingPayment}
                        >
                          {submittingPayment ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Complete Payment'
                          )}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About Child Space</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>
                  This is a private space where the nursery and parents can communicate about the child's daily activities, meals, nap times, and overall well-being.
                </p>
                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>Daily activity updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Private communication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span>Payment management</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
