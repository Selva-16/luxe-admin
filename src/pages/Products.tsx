import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

const products: Product[] = [
  {
    id: 1,
    name: "Air Max Classic",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    category: "running",
    size: [7, 8, 9, 10, 11],
    color: ["black", "white", "red"],
    description: "Classic running shoes with air cushioning."
  },
  {
    id: 2,
    name: "Casual Comfort",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
    category: "casual",
    size: [6, 7, 8, 9, 10],
    color: ["brown", "black"],
    description: "Everyday casual shoes for maximum comfort."
  },
  {
    id: 3,
    name: "Sport Elite",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    category: "sport",
    size: [7, 8, 9, 10, 11, 12],
    color: ["blue", "black", "white"],
    description: "High-performance sports shoes."
  },
];

export default function Products() {
  const { addToCart } = useCart();
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    size: '',
  });
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');

  const filteredProducts = products.filter(product => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.size && !product.size.includes(Number(filters.size))) return false;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (product.price < min || product.price > max) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64 space-y-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              <option value="running">Running</option>
              <option value="casual">Casual</option>
              <option value="sport">Sport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
            >
              <option value="">All Prices</option>
              <option value="0-100">$0 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200-300">$200+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Size</label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={filters.size}
              onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
            >
              <option value="">All Sizes</option>
              {[6, 7, 8, 9, 10, 11, 12].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="border rounded-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(Number(e.target.value))}
                    >
                      <option value={0}>Select Size</option>
                      {product.size.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Color</label>
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select Color</option>
                      {product.color.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedSize && selectedColor) {
                        addToCart(product, selectedSize, selectedColor);
                      }
                    }}
                    disabled={!selectedSize || !selectedColor}
                    className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}