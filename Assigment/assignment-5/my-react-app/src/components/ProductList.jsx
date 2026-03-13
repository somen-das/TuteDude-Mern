import React from 'react';
import useFetch from '../hooks/useFetch';

const ProductList = () => {
  const { data, loading, error } = useFetch('https://api.escuelajs.co/api/v1/products');

  if (loading) {
    return (
      <div className="status-container">
        <p>Loading ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error">
        <p>Oops! Something went wrong.</p>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h1 className="header-title">Store Products</h1>
      
      <div className="product-grid">
        {data && data.slice(0, 20).map((product) => {
          const imageUrl = product.images?.[0]?.replace(/[["]/g, '') || 'https://via.placeholder.com/150';

          return (
            <div key={product.id} className="product-card">
              <img
                src={imageUrl}
                alt={product.title}
                className="product-image"
              />
              <div className="product-info">
                <h2 className="product-title">{product.title}</h2>
                <p className="product-price">${product.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;