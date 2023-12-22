import React, { useState, useEffect } from 'react';
import './Customer.css';

const Customer = () => {
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    surname: '',
    type: '',
    voiting: 0,
  });
  const [newCustomerProduct, setNewCustomerProduct] = useState({
    customerId: '',
    productId: '',
    usedPerMonth: 0,
  });

  useEffect(() => {
    fetchCustomerAndProductList();
  }, []);

  const fetchCustomerAndProductList = async () => {
    try {
      // Fetch customer list
      const customerResponse = await fetch('http://localhost:5058/api/Customer/GetCustomers');
      if (!customerResponse.ok) {
        throw new Error(`HTTP error! Status: ${customerResponse.status}`);
      }
      const customerData = await customerResponse.json();
      setCustomerList(customerData);

      // Fetch product list
      const productResponse = await fetch('http://localhost:5058/api/CustomerProduct/GetCustomerProducts');
      if (!productResponse.ok) {
        throw new Error(`HTTP error! Status: ${productResponse.status}`);
      }
      const productData = await productResponse.json();
      setProductList(productData.productList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewCustomer({
      ...newCustomer,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/Customer/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      fetchCustomerAndProductList();
  
      // Create işlemi tamamlandıktan sonra input alanları temizle
      setNewCustomer({
        name: '',
        surname: '',
        type: '',
        voiting: 0,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  const handleInputChangeForProduct = (e) => {
    setNewCustomerProduct({
      ...newCustomerProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateCustomerProduct = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/CustomerProduct/Create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomerProduct),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      fetchCustomerAndProductList();
  
      // Create işlemi tamamlandıktan sonra input alanları temizle
      setNewCustomerProduct({
        customerId: '',
        productId: '',
        usedPerMonth: 0,
      });
    } catch (error) {
      console.error('Error creating customer product:', error);
    }
  };
  

  return (
    <div className="customer-container">
      <h2>Customer List</h2>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Type</th>
            <th>Voiting</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {customerList.map((customer, index) => (
            <tr key={index}>
              <td>{customer.name}</td>
              <td>{customer.surname}</td>
              <td>{customer.type}</td>
              <td>{customer.voiting}</td>
              <td>{new Date(customer.createdDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="customer-form">
        <h3>Yeni Müşteri</h3>
        <label>Name:</label>
        <input type="text" name="name" value={newCustomer.name} onChange={handleInputChange} />
        <label>Surname:</label>
        <input type="text" name="surname" value={newCustomer.surname} onChange={handleInputChange} />
        <label>Type:</label>
        <input type="text" name="type" value={newCustomer.type} onChange={handleInputChange} />
        <label>Voiting:</label>
        <input type="number" name="voiting" value={newCustomer.voiting} onChange={handleInputChange} />
        <button onClick={handleCreateCustomer}>Create Customer</button>
      </div>

      <div className="customer-product-form">
        <h3>Müşteri Tüketimi Ekle</h3>
        <label>Customer:</label>
        <select
          name="customerId"
          value={newCustomerProduct.customerId}
          onChange={handleInputChangeForProduct}
        >
          <option value="">Select Customer</option>
          {customerList.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        <label>Product:</label>
        <select
          name="productId"
          value={newCustomerProduct.productId}
          onChange={handleInputChangeForProduct}
        >
          <option value="">Select Product</option>
          {productList.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName}
            </option>
          ))}
        </select>
        <label>Used Per Month:</label>
        <input
          type="number"
          name="usedPerMonth" 
          value={newCustomerProduct.usedPerMonth}
          onChange={handleInputChangeForProduct}
        />
        <button onClick={handleCreateCustomerProduct}>Create Customer Product</button>
      </div>
    </div>
  );
};

export default Customer;
