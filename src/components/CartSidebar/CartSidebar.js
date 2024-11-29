import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';
import { fetchCartProducts } from '../../api/cartapi'; // Sepetteki ürünleri almak için API
import { getProductImage } from '../../api/storeapi'; // Ürün resimlerini almak için API

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]); // Sepet ürünleri
  const [total, setTotal] = useState(0); // Toplam fiyat
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const [error, setError] = useState(null); // Hata durumu

  useEffect(() => {
    const loadCartProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchCartProducts();
        console.log("response: ", response.data); // Sepetteki ürünleri al
        const cartData = response.data;

        if (cartData && cartData.products && cartData.products.length > 0) {
          // Ürünler ve resimlerini yükle
          const productsWithImages = await Promise.all(
            cartData.products.map(async (product) => {
              try {
                const imageResponse = await getProductImage(product.productID);
                const imageUrl = URL.createObjectURL(imageResponse.data);
                return { ...product, imageUrl }; // Ürün bilgilerine imageUrl ekle
              } catch (err) {
                console.error(`Error fetching image for product ${product.productID}:`, err);
                return { ...product, imageUrl: '/assets/images/default.jpg' }; // Hata durumunda varsayılan resim
              }
            })
          );

          setCartItems(productsWithImages); // Ürünleri state'e aktar
          const calculatedTotal = productsWithImages.reduce(
            (sum, item) => sum + item.productPrice * item.quantity,
            0
          );
          setTotal(calculatedTotal); // Toplam fiyatı hesapla
        } else {
          setCartItems([]);
          setTotal(0); // Sepet boşsa toplam fiyatı sıfırla
        }
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError('Failed to load cart data.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadCartProducts(); // Sidebar açıkken sepet verilerini yükle
    }
  }, [isOpen]);

  const handlePayment = () => {
    onClose(); // Sidebar'ı kapat
    navigate('/payment'); // Ödeme sayfasına yönlendir
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      <h2>Your Cart</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productID} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.productName}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ${item.productPrice}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>
          <button className="pay-now-button" onClick={handlePayment}>
            Pay Now
          </button>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartSidebar;
