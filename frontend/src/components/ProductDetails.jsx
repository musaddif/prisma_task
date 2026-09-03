import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="product-details-container">
          <p className="product-details-error">Product not found</p>
          <button className="back-button" onClick={handleBack}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Dashboard
        </button>

        <div className="product-details-content">
          <div className="product-details-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-info">
            <h1 className="product-details-name">{product.name}</h1>
            <p className="product-details-price">
              ${product.price.toFixed(2)}
            </p>

            <div className="product-details-stock in-stock">
              {product.stock} units in stock
            </div>

            <p className="product-details-description">
              {product.description}
            </p>

            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
