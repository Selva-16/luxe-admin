import React, { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAuthModalOpen: (state: boolean) => void;
  setIsCartOpen: (state: boolean) => void;
}

const categories = ['All', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage'];

const Navbar: React.FC<NavbarProps> = ({ setSelectedCategory, setSearchQuery, setIsAuthModalOpen, setIsCartOpen }) => {
  const { state } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-gray-900 cursor-pointer">
            LuxeFurnish
          </h1>

          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-600" />
                <span className="text-gray-700 font-medium">{user.email}</span>
                <button onClick={signOut} className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            )}

            <button className="p-2 rounded-full hover:bg-gray-100 relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
