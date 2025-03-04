const Hero: React.FC = () => {
    return (
      <div className="relative pt-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt="Modern living room"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-40"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Elevate Your Living Space
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Discover our curated collection of premium furniture that combines style, comfort, and quality craftsmanship.
          </p>
          <div className="mt-10">
            <a href="#products" className="inline-block bg-white px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 hover:bg-gray-100">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  export default Hero;
  