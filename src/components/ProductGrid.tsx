import React from 'react';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Modern Leather Sofa',
    category: 'sofas',
    price: 1299,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Luxurious leather sofa with clean lines and premium comfort.'
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    category: 'chairs',
    price: 399,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Comfortable office chair with adjustable features.'
  },
  {
    id: 3,
    name: 'Solid Wood Dining Table',
    category: 'tables',
    price: 899,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful dining table crafted from solid oak wood.'
  },
  {
    id: 4,
    name: 'Queen Platform Bed',
    category: 'beds',
    price: 799,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'Modern platform bed with built-in storage.'
  },
];

interface ProductGridProps {
  category: string;
  searchQuery: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ category, searchQuery }) => {
  const { dispatch } = useCart();

  const filteredProducts = products
    .filter(product => category === 'all' || product.category === category)
    .filter(product => 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddToCart = (product: Product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
  };

  return (
    <div id="products" className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-md shadow-sm text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                >
                  Add to Cart
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">Rs.{product.price}</p>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;