import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Baby, MapPin, Users, DollarSign, Star, ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

export default function BrowseNurseries() {
  const navigate = useNavigate();
  const [nurseries, setNurseries] = useState<any[]>([]);
  const [filteredNurseries, setFilteredNurseries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('name');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    loadNurseries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [nurseries, searchQuery, priceRange, sortBy, minRating]);

  const loadNurseries = async () => {
    try {
      const { nurseries: data } = await api.getAllNurseries();
      setNurseries(data || []);
    } catch (error) {
      console.error('Load nurseries error:', error);
      toast.error('Failed to load nurseries');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...nurseries];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (n) =>
          n.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (n) => n.price >= priceRange[0] && n.price <= priceRange[1]
    );

    // Rating filter
    filtered = filtered.filter((n) => (n.rating || 0) >= minRating);

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredNurseries(filtered);
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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Baby className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Jinen
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Browse Nurseries</h2>
          <p className="text-gray-600">Find the perfect nursery for your child</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Name or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={2000}
                    step={50}
                    className="py-4"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Rating */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Rating</label>
                  <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Ratings</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSearchQuery('');
                    setPriceRange([0, 2000]);
                    setSortBy('name');
                    setMinRating(0);
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Mobile Filters */}
            <div className="lg:hidden flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search nurseries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your nursery search</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Price Range: ${priceRange[0]} - ${priceRange[1]}
                      </label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={0}
                        max={2000}
                        step={50}
                        className="py-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                          <SelectItem value="price-low">Price (Low to High)</SelectItem>
                          <SelectItem value="price-high">Price (High to Low)</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Minimum Rating</label>
                      <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">All Ratings</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Header */}
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                {filteredNurseries.length} {filteredNurseries.length === 1 ? 'nursery' : 'nurseries'} found
              </p>
            </div>

            {/* Nursery Cards */}
            {filteredNurseries.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Baby className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No nurseries found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredNurseries.map((nursery) => (
                  <Card
                    key={nursery.id}
                    className="cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => navigate(`/nurseries/${nursery.id}`)}
                  >
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-lg relative overflow-hidden">
                      {nursery.imageUrl ? (
                        <img src={nursery.imageUrl} alt={nursery.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Baby className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{nursery.name}</CardTitle>
                        {nursery.rating > 0 && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {nursery.rating.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {nursery.location || 'Location not specified'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Price/month
                          </span>
                          <span className="font-semibold">${nursery.price || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Available places
                          </span>
                          <Badge variant="outline">{nursery.availablePlaces || 0}</Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
