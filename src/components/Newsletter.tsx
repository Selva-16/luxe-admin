import React from 'react';

const Newsletter: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-lg py-12 px-6 my-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter for exclusive offers, design tips, and new product announcements.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-md flex-1 max-w-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;