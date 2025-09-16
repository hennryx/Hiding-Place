import React from "react";
import { Link } from "react-router-dom";
import { toDateNoTime } from "../../services/utilities/convertDate";
import NoImage from "../../assets/No-Image.webp";

const ProductCard = ({ product, _index }) => {
  return (
    <Link
      to={`/productPreview/${product._id}`}
      key={_index}
      className="relative z-1 bg-white rounded-2xl shadow hover:shadow-md border border-transparent hover:border-blue-600 transition duration-300"
    >
      <div className="flex flex-col md:flex-row-reverse ">
        {/* Image Section */}
        <div className="h-48 sm:h-56 md:h-64 bg-white rounded-2xl flex items-center justify-center p-4">
          <img
            src={product.image?.url || NoImage}
            alt={product.productName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = NoImage;
            }}
          />
        </div>

        {/* small screen */}
        <div className="block md:hidden">
          <div className="flex flex-col p-3 flex-1 w-full">
            <p className="text-sm font-medium text-gray-900 truncate mb-2">
              {product.productName}
            </p>

            <div className="flex justify-between items-end mt-auto">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-green-700">
                  ₱{product.sellingPrice}
                </span>
                <span className="text-sm font-bold text-gray-500">
                  Stock: {product.totalStock}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {product?.totalSold || 0} sold
              </span>
            </div>
          </div>
        </div>

        {/* big screen */}
        <div className="hidden md:block max-w-1/2 ">
          <div className="flex flex-col p-3 flex-1 w-full">
            <p className="text-md font-semibold text-gray-900 truncate mb-2">
              {product.productName}
            </p>
            <p className="text-sm line-clamp-3 text-wrap font-medium text-gray-900 truncate mb-2">
              {product.description}
            </p>

            <span className="text-md font-bold text-green-700">
              ₱{product.sellingPrice}
            </span>
            <span className="text-sm text-gray-500">
              {product?.totalSold || 0} sold
            </span>
            <span className="text-sm text-gray-500">
              Stock: {product.totalStock}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
