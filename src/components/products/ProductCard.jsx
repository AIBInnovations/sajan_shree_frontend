// components/products/ProductCard.jsx
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="aspect-w-3 aspect-h-2 mb-4">
        <img
          src={product.image || 'https://via.placeholder.com/300x200'}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md"
        />
      </div>
      <h3 className="font-semibold text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.sku}</p>
      <p className="text-lg font-medium text-gray-900 mt-2">₹{product.price}</p>
      <div className="flex items-center justify-between mt-4">
        <span className={`px-2 py-1 text-xs rounded-full ${
          product.stock <= product.minStock 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {product.stock} in stock
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(product.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;