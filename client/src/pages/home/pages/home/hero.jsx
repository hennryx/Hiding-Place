import { Star, MapPin, Phone } from "lucide-react";

export default function Hero() {
    const onGetStarted = () => {};

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1567491634123-460945ea86dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXNvcnQlMjBwb29sJTIwdHJvcGljYWx8ZW58MXx8fHwxNzU3ODAzNDc3fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Luxury Resort Pool"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent"></div>
            </div>

            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col justify-center items-center">
                <span className="flex flex-row items-center justify-center gap-1 w-fit mb-6 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-full backdrop-blur-sm text-sm">
                    <MapPin size={15} /> Hiding Place Mission Farm
                </span>
                <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                    Paradise
                    <br />
                    <span className="bg-gradient-to-r from-orange-300 to-orange-100 bg-clip-text text-transparent">
                        Awaits You
                    </span>
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Discover unparalleled luxury at Hidding Place Farm and
                    Resort. From ultimate hidding getaway in paradise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-8 py-3 bg-white text-orange-600 hover:bg-orange-50 text-lg rounded-md shadow-xl transition-colors flex items-center justify-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Call us
                    </button>
                    <button className="px-8 py-3 text-lg border border-white/50 text-white hover:bg-white/10 rounded-md backdrop-blur-sm transition-colors flex items-center justify-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Virtual Tour
                    </button>
                </div>
            </div>

            {/* Floating rating badge */}
            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className="w-4 h-4 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                        4.9/5
                    </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">2,847 Reviews</p>
            </div>
        </section>
    );
}
