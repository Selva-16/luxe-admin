import React from 'react';

const blogPosts = [
  {
    id: 1,
    title: '10 Tips for Choosing the Perfect Sofa',
    excerpt: 'Learn how to select a sofa that combines style, comfort, and durability...',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: 'Mar 15, 2025'
  },
  {
    id: 2,
    title: 'Spring Interior Design Trends',
    excerpt: 'Discover the latest interior design trends for the upcoming season...',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: 'Mar 10, 2025'
  },
  {
    id: 3,
    title: 'Small Space Living Solutions',
    excerpt: 'Creative furniture arrangements and storage ideas for compact homes...',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    date: 'Mar 5, 2025'
  }
];

const BlogSection: React.FC = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Design Inspiration</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="group">
            <div className="relative">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">{post.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-gray-600">
                {post.title}
              </h3>
              <p className="mt-2 text-gray-500">{post.excerpt}</p>
              <a
                href="#"
                className="mt-4 inline-block text-sm font-medium text-gray-900 hover:text-gray-600"
              >
                Read More →
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;