import {
    Waves,
    Bed,
    Utensils,
    Wifi,
    Car,
    Dumbbell,
    Bubbles,
} from "lucide-react";

const Amenities = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-orange-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">
                        Amenities
                    </h3>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Indulge in facilities designed for the ultimate resort
                        experience
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white border border-orange-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Bubbles className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold mb-3">spa</h4>
                        <p className="text-gray-600">
                            At the lodge guests are welcome to use a spa center.
                        </p>
                    </div>

                    <div className="bg-white border border-orange-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Bed className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold mb-3">
                            Extra beds
                        </h4>
                        <p className="text-gray-600">
                            Please contact the hotel for details about adding
                            extra beds.
                        </p>
                    </div>

                    <div className="bg-white border border-orange-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Utensils className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold mb-3">Food</h4>
                        <p className="text-gray-600">
                            guests can enjoy a garden, a restaurant and a bar.
                        </p>
                    </div>

                    <div className="bg-white border border-orange-100 rounded-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Wifi className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-semibold mb-3">
                            Connectivity
                        </h4>
                        <p className="text-gray-600">
                            Hiding Place Mission Farm provides free WiFi
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Amenities;
