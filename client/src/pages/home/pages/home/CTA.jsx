import { Phone, Calendar, Users } from "lucide-react";

const CTA = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-orange-50 to-white">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    Ready to Hide?
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Book now at Hidden Place and create memories that will last
                    a lifetime.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* <button className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white text-lg rounded-md shadow-xl transition-all flex items-center justify-center">
            <Calendar className="w-5 h-5 mr-2" />
            Book Now
          </button> */}
                    <button className="px-8 py-3 text-lg border border-orange-300 text-orange-700 hover:bg-orange-50 rounded-md transition-colors flex items-center justify-center">
                        <Phone className="w-5 h-5 mr-2" />
                        Call +1 (555) 123-4567
                    </button>
                </div>

                {/* <div className="mt-12 pt-8 border-t border-orange-200">
                    <p className="text-sm text-gray-500 mb-4">
                        Resort Staff Access
                    </p>
                    <button className="px-4 py-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors flex items-center mx-auto">
                        <Users className="w-4 h-4 mr-2" />
                        Staff Management Portal
                    </button>
                </div> */}
            </div>
        </section>
    );
};

export default CTA;
