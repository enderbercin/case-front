import React, { useState, useEffect } from 'react';
import './Report.css';

const Report = () => {
  const [reportData, setReportData] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [searchCustomerName, setSearchCustomerName] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [filterByCustomer, setFilterByCustomer] = useState('');
  const [filterByProduct, setFilterByProduct] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/Dashboard', {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Rapor verilerini oluştur
      const report = data.flatMap(customer => {
        const customerName = `${customer.customerName} ${customer.customerSurname}`;
        return customer.usedProductsList.map(product => ({
          customerName,
          productName: product.name,
          productPrice: product.unitPrice,
          monthlyUsage: product.unitPricePerMounth,
          monthlyCost: product.unitPricePerMounth * product.unitPrice,
        }));
      });

      setReportData(report);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('http://localhost:5058/api/Report/ExportToExcel', {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapor.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  const handleFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleImportFromExcel = async () => {
    if (!excelFile) {
      console.error('Please select an Excel file.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', excelFile);
  
    try {
      const response = await fetch('http://localhost:5058/api/Report/ImportFromExcel', {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('File uploaded successfully!');
  
      // Verileri sıfırla ve yeniden çek
      setReportData([]);
  
      // Yeniden veri çek
      fetchData();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const filterData = () => {
    const filteredData = reportData.filter(item =>
      item.customerName.toLowerCase().includes(searchCustomerName.toLowerCase()) &&
      item.productName.toLowerCase().includes(searchProduct.toLowerCase()) &&
      (filterByCustomer === '' || item.customerName === filterByCustomer) &&
      (filterByProduct === '' || item.productName === filterByProduct)
    );
    return filteredData;
  };

  const customerOptions = Array.from(new Set(reportData.map(item => item.customerName)));
  const productOptions = Array.from(new Set(reportData.map(item => item.productName)));

  return (
    <div className="report-container">
      <div className="filters">
        <div className="filter-item">
          <label>Müşteri Ara</label>
          <input type="text" value={searchCustomerName} onChange={(e) => setSearchCustomerName(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Ürün Ara</label>
          <input type="text" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
        </div>
        <div className="filter-item">
          <label>Müşteriye göre filtrele</label>
          <select value={filterByCustomer} onChange={(e) => setFilterByCustomer(e.target.value)}>
            <option value="">All</option>
            {customerOptions.map((customer, index) => (
              <option key={index} value={customer}>{customer}</option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label>Ürüne Göre Filtrele</label>
          <select value={filterByProduct} onChange={(e) => setFilterByProduct(e.target.value)}>
            <option value="">All</option>
            {productOptions.map((product, index) => (
              <option key={index} value={product}>{product}</option>
            ))}
          </select>
        </div>
      </div>
      <h2>Report</h2>
      <div className="button-container">
        <button onClick={handleDownloadExcel}>Excel Olarak İndir</button>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button onClick={handleImportFromExcel}>Excel Yükle</button>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Müşteri Adı Soyadı</th>
            <th>Ürün Adı</th>
            <th>Ürün Birim Fiyatı</th>
            <th>Aylık Kullanım</th>
            <th>Aylık Maliyet</th>
          </tr>
        </thead>
        <tbody>
          {filterData().map((item, index) => (
            <tr key={index}>
              <td>{item.customerName}</td>
              <td>{item.productName}</td>
              <td>{item.productPrice}</td>
              <td>{item.monthlyUsage}</td>
              <td>{item.monthlyCost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Report;
