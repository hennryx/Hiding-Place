import React from "react";

const Gallery = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">
                        Experience Paradise
                    </h3>
                    <p className="text-xl text-gray-600">
                        A glimpse into your Hiding place
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                        <img
                            src="https://images.unsplash.com/photo-1558117338-aa433feb1c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcmVzb3J0fGVufDF8fHx8MTc1NzczNTY1NHww&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Tropical Beach Resort"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                    <div className="space-y-8">
                        <div className="h-44 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                            <img
                                src="https://images.unsplash.com/photo-1601565415267-724db0e9fbdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBsdXh1cnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTc3NTY5NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Luxury Hotel Room"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="h-44 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                            <img
                                src="https://images.unsplash.com/photo-1730367019975-4ad8d9e14ef2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNvcnQlMjBzcGElMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NTc4MDM0Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Resort Spa Wellness"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    <div className="lg:col-span-3 h-64 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow">
                        <img
                            src="https://images.unsplash.com/photo-1543539571-2d88da875d21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlc3RhdXJhbnQlMjBkaW5pbmd8ZW58MXx8fHwxNzU3NzU1MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Hotel Restaurant Dining"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
