import { Clock, Coffee, MapPin, Phone, Star } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-200 text-black py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-orange-400 rounded-md flex items-center justify-center">
                                <Coffee className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">
                                Hiding Place Mission Farm
                            </span>
                        </div>
                        <p className="text-black mb-4">
                            Hidding place awaits you. Experience good service,
                            in a good place.
                        </p>
                        <div className="flex space-x-4">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <Star className="w-5 h-5 text-yellow-400" />
                            <Star className="w-5 h-5 text-yellow-400" />
                            <Star className="w-5 h-5 text-yellow-400" />
                            <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">
                            Contact Information
                        </h4>
                        <div className="space-y-2 text-black">
                            <div className="flex items-center space-x-2">
                                <Phone size={20} />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin size={20} />
                                <span>
                                    0435, Lola Mayang Compound, Purok Mangga,
                                    Brgy. Concepcion, General Tinio, N.E
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock size={20} />
                                <div className="flex flex-col">
                                    <span>Check in from: 14:00</span>
                                    <span>Check out before: 12:00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resort Amenities</h4>
                        <div className="grid grid-cols-2 gap-2 text-black text-sm">
                            <span>• Spa</span>
                            <span>• Food</span>
                            <span>• Extra bed</span>
                            <span>• COT</span>
                            <span>• Wifi</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-black">
                    <p>© 2025 Hidden Place Resort. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
