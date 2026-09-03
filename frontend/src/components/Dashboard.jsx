import { useNavigate } from "react-router-dom";
import { products } from "../data";
import "./Dashboard.css";
import "./Products.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const product = products[0];

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        <div className="dashboard-content">
          {/* <div className="dashboard-actions">
            <button className="checkout-button" onClick={handleCheckout}>
              🛒 Checkout
            </button> 
          </div>*/}

          <div className="products-section">
            <h2>Product</h2>
            <div
              className="product-card"
              onClick={handleProductClick}
            >
              <div className="product-card-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-card-info">
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-price">
                  ${product.price.toFixed(2)}
                </p>
                <span className="product-card-stock in-stock">
                  {product.stock} in stock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
