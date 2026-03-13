import { useNavigate } from 'react-router-dom';
import { MdClose, MdAdd, MdRemove, MdDeleteOutline, MdShoppingCartCheckout } from 'react-icons/md';
import { useCart } from '../context/CartContext';
import styles from '../styles/CartPopup.module.scss';

const CartPopup = ({ onClose }) => {
    const { cartItems, removeFromCart, updateQty, totalPrice } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className={styles.popup}>

            {/* Header */}
            <div className={styles.header}>
                <h3 className={styles.title}>Your Cart</h3>
                <button className={styles.closeBtn} onClick={onClose}>
                    <MdClose size={20} />
                </button>
            </div>

            <hr className={styles.divider} />

            {/* Items */}
            {cartItems.length === 0 ? (
                <div className={styles.empty}>
                    <p>Your cart is empty</p>
                </div>
            ) : (
                <>
                    <ul className={styles.list}>
                        {cartItems.map(item => (
                            <li key={item.id} className={styles.item}>
                                <img src={item.image} alt={item.name} className={styles.itemImg} />
                                <div className={styles.itemInfo}>
                                    <p className={styles.itemName}>{item.name}</p>
                                    <p className={styles.itemPrice}>Rs {item.price.toLocaleString()}</p>

                                    {/* Qty controls */}
                                    <div className={styles.qtyRow}>
                                        {/* Minus — disabled at qty 1 */}
                                        <button
                                            className={`${styles.qtyBtn} ${item.qty <= 1 ? styles.qtyBtnDisabled : ''}`}
                                            onClick={() => item.qty > 1 && updateQty(item.id, item.qty - 1)}
                                            disabled={item.qty <= 1}
                                        >
                                            <MdRemove size={14} />
                                        </button>

                                        <span className={styles.qty}>{item.qty}</span>

                                        {/* Plus */}
                                        <button
                                            className={styles.qtyBtn}
                                            onClick={() => updateQty(item.id, item.qty + 1)}
                                        >
                                            <MdAdd size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Delete */}
                                <button className={styles.deleteBtn} onClick={() => removeFromCart(item.id)}>
                                    <MdDeleteOutline size={20} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <hr className={styles.divider} />

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.total}>
                            <span>Total</span>
                            <span className={styles.totalPrice}>Rs {totalPrice.toLocaleString()}</span>
                        </div>
                        <button className={styles.checkoutBtn} onClick={handleCheckout}>
                            <MdShoppingCartCheckout size={18} />
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPopup;