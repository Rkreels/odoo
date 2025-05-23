
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Package, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RentalProduct, RentalBooking } from '@/types/rental';
import ProductCard from '@/components/rental/ProductCard';
import BookingCard from '@/components/rental/BookingCard';
import { toast } from "@/components/ui/use-toast";

const Rental = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<RentalProduct[]>([
    {
      id: '1',
      name: 'Professional Camera',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&h=200',
      dailyRate: '$35',
      weeklyRate: '$210',
      monthlyRate: '$700',
      status: 'available',
      features: ['4K video', 'Stabilizer', 'Extra lenses'],
      location: 'New York Store',
      description: 'Professional-grade camera perfect for photography and videography projects.'
    },
    {
      id: '2',
      name: 'Conference Room Setup',
      category: 'Office Equipment',
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=400&h=200',
      dailyRate: '$150',
      weeklyRate: '$900',
      monthlyRate: '$3000',
      status: 'rented',
      features: ['Projector', 'Sound system', 'Video conferencing'],
      location: 'Chicago Branch',
      description: 'Complete conference room setup for professional meetings and presentations.'
    },
    {
      id: '3',
      name: 'Heavy Duty Excavator',
      category: 'Construction',
      image: 'https://images.unsplash.com/photo-1533603208986-24fd819e683a?q=80&w=400&h=200',
      dailyRate: '$300',
      weeklyRate: '$1800',
      monthlyRate: '$5400',
      status: 'maintenance',
      features: ['20-ton capacity', 'GPS tracking', 'Climate controlled cabin'],
      location: 'Dallas Warehouse',
      description: 'Heavy-duty excavator for construction and landscaping projects.'
    },
    {
      id: '4',
      name: 'Portable Party Tent',
      category: 'Events',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=400&h=200',
      dailyRate: '$120',
      weeklyRate: '$700',
      monthlyRate: '$2500',
      status: 'available',
      features: ['10x20 meters', 'Weather-resistant', 'Setup included'],
      location: 'Miami Branch',
      description: 'Large event tent perfect for outdoor gatherings, parties and events.'
    }
  ]);
  
  const [bookings, setBookings] = useState<RentalBooking[]>([
    {
      id: '1',
      productId: '2',
      productName: 'Conference Room Setup',
      customer: 'Global Corp',
      startDate: '2025-05-15',
      endDate: '2025-05-22',
      totalPrice: '$900',
      status: 'in-progress'
    },
    {
      id: '2',
      productId: '1',
      productName: 'Professional Camera',
      customer: 'Media Productions',
      startDate: '2025-05-25',
      endDate: '2025-05-28',
      totalPrice: '$105',
      status: 'confirmed'
    },
    {
      id: '3',
      productId: '4',
      productName: 'Portable Party Tent',
      customer: 'Event Planners Inc.',
      startDate: '2025-04-10',
      endDate: '2025-04-12',
      totalPrice: '$240',
      status: 'completed'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleRentProduct = (product: RentalProduct) => {
    toast({
      title: "Rental process started",
      description: `You've initiated the rental process for ${product.name}.`,
    });
  };
  
  const handleViewProductDetails = (product: RentalProduct) => {
    toast({
      title: "Product details",
      description: `Viewing details of ${product.name}.`,
    });
  };
  
  const handleViewBookingDetails = (booking: RentalBooking) => {
    toast({
      title: "Booking details",
      description: `Viewing details of booking for ${booking.productName}.`,
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'canceled' } 
          : booking
      )
    );
    
    toast({
      title: "Booking canceled",
      description: "The booking has been canceled successfully.",
      variant: "destructive",
    });
  };

  return (
    <TopbarDashboardLayout currentApp="Rental">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Rental Management</h1>
                <p className="text-odoo-gray">
                  Manage rental products, bookings, and inventory for optimal utilization.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="products">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <div className="flex items-center justify-between mb-6">
                <div className="w-64">
                  <Input placeholder="Search products..." />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onRent={handleRentProduct}
                    onViewDetails={handleViewProductDetails}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="bookings">
              <div className="flex items-center justify-between mb-6">
                <div className="w-64">
                  <Input placeholder="Search bookings..." />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {bookings.map(booking => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onViewDetails={handleViewBookingDetails}
                    onCancelBooking={booking.status === 'confirmed' ? handleCancelBooking : undefined}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Rental;
