import React, { useEffect, useState } from "react";
import Hero from "./hero";
import CTA from "./CTA";
import Amenities from "./Amenities";
import Gallery from "./Gallery";
import useProductsStore from "../../../../services/stores/products/productsStore";
import Stats from "./Stats";

const Home = ({ handleToggle = () => {} }) => {
    const { getPublicProducts, data } = useProductsStore();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        getPublicProducts();
    }, []);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setProducts(data);
            console.log(data);

            const brands = [...new Set(data.map((item) => item.brand))].map(
                (brand, i) => ({ id: i + 1, brand: brand })
            );
            console.log(brands);
            setBrands(brands);
        }
    }, [data]);

    return (
        <main className="flex flex-col">
            <Hero handleToggle={handleToggle} />

            <Amenities />

            <Gallery />

            {/* <Stats /> */}

            <CTA />
        </main>
    );
};

export default Home;
