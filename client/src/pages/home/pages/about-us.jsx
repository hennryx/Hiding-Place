import React from 'react';

const AboutUs = () => {
    return (
        <div className="relative isolate min-h-lvh text-black">
            <div className='text-start py-20 flex flex-col gap-4'>
                <h1 className="text-4xl font-bold mb-6 text-center">About this Project</h1>
                <div className="flex flex-col justify-center items-center w-full">
                    <div className="max-w-3xl mx-auto flex flex-col gap-3 text-justify">
                        <p className="text-lg mb-4">
                        The Camille Retail Store Management System with  Inventory Monitoring is a professionally developed 
                        solution designed to optimize inventory processes in retail environments. Built with offline capabilities,
                         the system ensures uninterrupted operations while providing real-time inventory tracking and an intuitive user interface.
                         It aims to support retail businesses by minimizing manual errors, enhancing stock control, and enabling data-driven decision-making 
                         for improved operational efficiency.


                        </p>

                        <div>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
                            <p className="mb-4">
                                The development of the Camille Retail Store Management System with  Inventory Monitoring was inspired by the growing need 
                                for a reliable and efficient inventory solution tailored to the challenges of retail operations, particularly in areas with limited
                                 internet connectivity. Recognizing the gaps in traditional systems, the project was initiated to provide a smart, offline-capable platform 
                                 that streamlines inventory management. Through careful planning, innovation, and a focus on usability, the system was designed to enhance accuracy, 
                                 improve efficiency, and support informed decision-making for retail businesses.


                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
                            <p className="mb-4">
                            The mission of the Camille Retail Store Management System and Inventory Monitoring is to provide retail businesses with a  reliable, and user-friendly inventory management
                             solution. By integrating real-time monitoring and offline functionality, the system aims to simplify daily operations, minimize inventory errors, and empower 
                             store owners to make efficient, data-driven decisions. It is committed to enhancing operational performance and supporting sustainable growth in the retail sector.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
                            <p className="mb-4">
                            For inquiries, support, or further information about the Camille Retail Store Management System with  Inventory Monitoring, please don’t hesitate to get in touch. The development team is committed to providing prompt assistance and ensuring a smooth experience for all users.


                            </p>
                            <ul className="list-disc pl-6 mb-6">
                                <li>📧 Email: [your-email@example.com]</li>
                                <li>📞 Phone: [your contact number]</li>
                                <li>📍 Address: [Your location or institution, if applicable]
</li>
                            </ul>
                            <p>We look forward to assisting you.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;