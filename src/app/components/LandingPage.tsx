import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Baby, School, Users, Heart, MapPin, CreditCard, Calendar, Shield } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Jinen
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-purple-600 to-pink-600">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Connect Parents with the
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Perfect Nursery</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Jinen is your trusted platform for finding quality childcare. Browse nurseries, 
              manage enrollments, and stay connected with your child's daily activities.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/nurseries')}>
                Browse Nurseries
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1753742731151-da5b45dd8114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNoaWxkcmVuJTIwcGxheWluZyUyMG51cnNlcnl8ZW58MXx8fHwxNzcxMTg1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Happy children at nursery"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Jinen?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Find Nearby</h4>
                <p className="text-gray-600 text-sm">
                  Discover nurseries close to your location with interactive maps
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-pink-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Easy Payments</h4>
                <p className="text-gray-600 text-sm">
                  Secure online payment system with payment tracking
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Daily Updates</h4>
                <p className="text-gray-600 text-sm">
                  Stay informed with real-time updates about your child
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Secure & Private</h4>
                <p className="text-gray-600 text-sm">
                  Private communication channels between parents and nurseries
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1600563093202-337471bde37e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJlbnQlMjBjaGlsZCUyMGNhcmV8ZW58MXx8fHwxNzcxMTg1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Parent with child"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                For Parents
              </div>
              <h3 className="text-3xl font-bold mb-6">Everything You Need in One Place</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <School className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse & Compare</h4>
                    <p className="text-gray-600">Filter nurseries by location, price, rating, and available spaces</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Easy Registration</h4>
                    <p className="text-gray-600">Register your child online and track enrollment status</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Stay Connected</h4>
                    <p className="text-gray-600">Receive daily updates, photos, and messages from your child's nursery</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => navigate('/signup')}>
                Join as a Parent
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* For Nurseries Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                For Nursery Owners
              </div>
              <h3 className="text-3xl font-bold mb-6">Manage Your Nursery Efficiently</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <School className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Your Profile</h4>
                    <p className="text-gray-600">Showcase your nursery with photos, details, and pricing</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Update Programs</h4>
                    <p className="text-gray-600">Share daily activities and program schedules with parents</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Track Payments</h4>
                    <p className="text-gray-600">Manage enrollments and view payment history</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600" onClick={() => navigate('/signup')}>
                List Your Nursery
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1567746512136-f005499a7575?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZXJ5JTIwY2xhc3Nyb29tJTIwY29sb3JmdWx8ZW58MXx8fHwxNzcxMTg1NjgyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Nursery classroom"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
            <h3 className="text-4xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-8 opacity-90">Join thousands of parents and nurseries using Jinen</p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/signup')}>
              Create Your Account
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Baby className="w-6 h-6" />
            <span className="text-xl font-bold">Jinen</span>
          </div>
          <p className="text-gray-400 mb-4">Connecting families with quality childcare</p>
          <p className="text-sm text-gray-500">© 2026 Jinen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
