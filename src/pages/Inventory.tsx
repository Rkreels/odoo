
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Plus } from 'lucide-react';

const Inventory = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const products = [
    {
      id: 'P001',
      name: 'Acoustic Guitar',
      category: 'Instruments',
      onHand: 24,
      forecasted: 18,
      committed: 6,
      available: 18,
    },
    {
      id: 'P002',
      name: 'Office Desk',
      category: 'Furniture',
      onHand: 15,
      forecasted: 10,
      committed: 5,
      available: 10,
    },
    {
      id: 'P003',
      name: 'Wireless Keyboard',
      category: 'Electronics',
      onHand: 42,
      forecasted: 35,
      committed: 12,
      available: 30,
    },
    {
      id: 'P004',
      name: 'Ergonomic Chair',
      category: 'Furniture',
      onHand: 8,
      forecasted: 4,
      committed: 3,
      available: 5,
    },
    {
      id: 'P005',
      name: 'Smartphone Case',
      category: 'Accessories',
      onHand: 120,
      forecasted: 100,
      committed: 20,
      available: 100,
    },
  ];

  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(product => product.category.toLowerCase() === filterCategory.toLowerCase());

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredProducts.map(product => product.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getAvailabilityColor = (available: number) => {
    if (available <= 0) return 'bg-red-100 text-red-800';
    if (available < 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <TopbarDashboardLayout currentApp="Inventory">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-bold text-odoo-dark mb-4">Inventory Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Products', count: 5, color: 'bg-blue-500' },
              { name: 'Categories', count: 4, color: 'bg-yellow-500' },
              { name: 'Low Stock', count: 2, color: 'bg-red-500' },
              { name: 'Warehouses', count: 1, color: 'bg-purple-500' },
            ].map((metric) => (
              <div key={metric.name} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${metric.color} mr-2`}></div>
                  <h3 className="font-medium text-odoo-dark">{metric.name}</h3>
                </div>
                <p className="text-2xl font-bold mt-2 text-odoo-dark">{metric.count}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Button variant="outline" className="mr-2">
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              <Button variant="outline" className="mr-2" disabled={selectedItems.length === 0}>
                Mass Action
              </Button>
              <div className="relative ml-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-odoo-primary focus:border-odoo-primary w-full sm:w-auto"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <select 
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-odoo-primary focus:border-odoo-primary"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="instruments">Instruments</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="accessories">Accessories</option>
              </select>
              
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                Group By
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedItems.length === filteredProducts.length && filteredProducts.length > 0} 
                      onCheckedChange={toggleSelectAll} 
                      aria-label="Select all products"
                    />
                  </TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>On Hand</TableHead>
                  <TableHead>Forecasted</TableHead>
                  <TableHead>Committed</TableHead>
                  <TableHead>Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <Checkbox 
                          checked={selectedItems.includes(product.id)} 
                          onCheckedChange={() => toggleSelectItem(product.id)} 
                          aria-label={`Select ${product.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.onHand}</TableCell>
                      <TableCell>{product.forecasted}</TableCell>
                      <TableCell>{product.committed}</TableCell>
                      <TableCell>
                        <Badge className={getAvailabilityColor(product.available)} variant="outline">
                          {product.available}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No products found matching your filters. Try adjusting your search criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-odoo-gray">
              Showing {filteredProducts.length} of {products.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Inventory;
