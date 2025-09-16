const Stats = () => {
  return (
    <section className="bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/50 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-white mb-4">
            Award-Winning Excellence
          </h3>
          <p className="text-xl text-orange-100">
            Recognized worldwide for exceptional service and luxury
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 text-center text-white">
          <div className="group">
            <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              250+
            </div>
            <p className="text-orange-200">Luxury Suites</p>
          </div>
          <div className="group">
            <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              98%
            </div>
            <p className="text-orange-200">Guest Satisfaction</p>
          </div>
          <div className="group">
            <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <p className="text-orange-200">Concierge Service</p>
          </div>
          <div className="group">
            <div className="text-5xl font-bold mb-2 group-hover:scale-110 transition-transform">
              15+
            </div>
            <p className="text-orange-200">Global Awards</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
