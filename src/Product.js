// Product.js
import React, { useState, useEffect } from 'react';
import './Product.css'; // CSS dosyanızı ekleyin

const Product = () => {
  const [productData, setProductData] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    unitPrice: 0,
    substituteProductId: '',
  });

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/Product/GetProducts');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProductData(data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateProduct = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/Product/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      fetchProductData();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="product-container">
      <h2>Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {productData.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.unitPrice}</td>
              <td>{new Date(product.createdDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="product-form">
        <h3>Create New Product</h3>
        <label>Name:</label>
        <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} />
        <label>Unit Price:</label>
        <input type="number" name="unitPrice" value={newProduct.unitPrice} onChange={handleInputChange} />
        <label>Substitute Product ID:</label>
        <input type="text" name="substituteProductId" value={newProduct.substituteProductId} onChange={handleInputChange} />
        <button onClick={handleCreateProduct}>Create Product</button>
      </div>
    </div>
  );
};

export default Product;
