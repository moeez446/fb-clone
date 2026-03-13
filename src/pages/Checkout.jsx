import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdShoppingCartCheckout, MdCheckCircle } from "react-icons/md";
import { useCart } from "../context/CartContext";
import styles from "../styles/Checkout.module.scss";

/* ── Order Success Modal ── */
const SuccessModal = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.overlay}>
            <div className={styles.successModal}>
                <MdCheckCircle className={styles.successIcon} />
                <h2 className={styles.successTitle}>Order Placed! 🎉</h2>
                <p className={styles.successSub}>
                    Thank you for your order.<br />We'll send you a confirmation shortly.
                </p>
                <div className={styles.countdown}>
                    Redirecting in 3 seconds...
                </div>
            </div>
        </div>
    );
};

/* ── Checkout Page ── */
const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, totalPrice, removeFromCart, updateQty, clearCart, placeOrder } = useCart();
    const [showSuccess, setShowSuccess] = useState(false);

    const [form, setForm] = useState({
        firstName: "", lastName: "",
        email: "", phone: "",
        address: "", city: "",
        state: "", zip: "",
        cardName: "", cardNumber: "",
        expiry: "", cvv: "",
        easyPhone: "", easyName: "",
        paymentMethod: "card",
    });

    const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    /* ── Price calculations ── */
    const COD_CHARGE  = 100;
    const baseShipping = totalPrice > 5000 ? 0 : 299;
    const codExtra     = form.paymentMethod === "cod" ? COD_CHARGE : 0;
    const shipping     = baseShipping + codExtra;
    const tax          = Math.round(totalPrice * 0.05);
    const grand        = totalPrice + shipping + tax;

    const handleOrder = (e) => {
        e.preventDefault();
        placeOrder(form, cartItems, grand);
        setShowSuccess(true);
    };

    return (
        <div className={styles.page}>

            {/* ── Top Bar ── */}
            <div className={styles.topBar}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <MdArrowBack size={20} /> Back
                </button>
                <h1 className={styles.pageTitle}>Checkout</h1>
                {/* spacer to keep title centered */}
                <div style={{ visibility: "hidden", pointerEvents: "none" }}>
                    <button className={styles.backBtn}>
                        <MdArrowBack size={20} /> Back
                    </button>
                </div>
            </div>

            <div className={styles.container}>

                {/* ══════════════════════════
                    LEFT — Order Summary
                ══════════════════════════ */}
                <div className={styles.left}>
                    <h2 className={styles.sectionTitle}>Order Summary</h2>

                    {cartItems.length === 0 ? (
                        <p className={styles.emptyCart}>Your cart is empty.</p>
                    ) : (
                        <ul className={styles.itemList}>
                            {cartItems.map(item => (
                                <li key={item.id} className={styles.item}>
                                    <img src={item.image} alt={item.name} className={styles.itemImg} />
                                    <div className={styles.itemDetails}>
                                        <p className={styles.itemName}>{item.name}</p>
                                        <p className={styles.itemCategory}>{item.category}</p>
                                        <p className={styles.itemUnitPrice}>
                                            Rs {item.price.toLocaleString()} × {item.qty}
                                        </p>
                                        <div className={styles.qtyRow}>
                                            <button
                                                className={`${styles.qtyBtn} ${item.qty <= 1 ? styles.qtyBtnDisabled : ''}`}
                                                onClick={() => item.qty > 1 && updateQty(item.id, item.qty - 1)}
                                                disabled={item.qty <= 1}
                                            >−</button>
                                            <span className={styles.qty}>{item.qty}</span>
                                            <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                                            <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                    <p className={styles.itemTotal}>
                                        Rs {(item.price * item.qty).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Price Breakdown */}
                    <div className={styles.priceBox}>
                        <div className={styles.priceRow}>
                            <span>Subtotal</span>
                            <span>Rs {totalPrice.toLocaleString()}</span>
                        </div>
                        <div className={styles.priceRow}>
                            <span>Shipping</span>
                            <span className={baseShipping === 0 && codExtra === 0 ? styles.free : ""}>
                                {baseShipping === 0 && codExtra === 0 ? "Free" : `Rs ${shipping.toLocaleString()}`}
                            </span>
                        </div>
                        {/* COD extra charge note */}
                        {form.paymentMethod === "cod" && (
                            <div className={`${styles.priceRow} ${styles.codNote}`}>
                                <span>↳ COD Handling Fee</span>
                                <span>+ Rs {COD_CHARGE}</span>
                            </div>
                        )}
                        <div className={styles.priceRow}>
                            <span>Tax (5%)</span>
                            <span>Rs {tax.toLocaleString()}</span>
                        </div>
                        <hr className={styles.priceDivider} />
                        <div className={`${styles.priceRow} ${styles.grandTotal}`}>
                            <span>Total</span>
                            <span>Rs {grand.toLocaleString()}</span>
                        </div>
                        {baseShipping === 0 && (
                            <p className={styles.freeShippingNote}>🎉 You qualify for free shipping!</p>
                        )}
                    </div>
                </div>

                {/* ══════════════════════════
                    RIGHT — User Info Form
                ══════════════════════════ */}
                <form className={styles.right} onSubmit={handleOrder}>

                    {/* Personal Info */}
                    <h2 className={styles.sectionTitle}>Personal Information</h2>
                    <div className={styles.formGrid2}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>First Name</label>
                            <input className={styles.input} name="firstName" placeholder="Abdul" value={form.firstName} onChange={handle} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Last Name</label>
                            <input className={styles.input} name="lastName" placeholder="Moeez" value={form.lastName} onChange={handle} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Email</label>
                            <input className={styles.input} type="email" name="email" placeholder="abdulmoeez@gmail.com" value={form.email} onChange={handle} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Phone</label>
                            <input className={styles.input} type="tel" name="phone" placeholder="+92 300 0000000" value={form.phone} onChange={handle} required />
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <h2 className={`${styles.sectionTitle} ${styles.mt}`}>Shipping Address</h2>
                    <div className={styles.formGrid1}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>Street Address</label>
                            <input className={styles.input} name="address" placeholder="123 Main Street" value={form.address} onChange={handle} required />
                        </div>
                    </div>
                    <div className={styles.formGrid3}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>City</label>
                            <input className={styles.input} name="city" placeholder="Lahore" value={form.city} onChange={handle} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>State</label>
                            <input className={styles.input} name="state" placeholder="Punjab" value={form.state} onChange={handle} required />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label className={styles.label}>ZIP</label>
                            <input className={styles.input} name="zip" placeholder="54000" value={form.zip} onChange={handle} required />
                        </div>
                    </div>

                    {/* Payment */}
                    <h2 className={`${styles.sectionTitle} ${styles.mt}`}>Payment Method</h2>
                    <div className={styles.paymentMethods}>
                        {[
                            { value: "card",      label: "💳 Credit / Debit Card" },
                            { value: "cod",       label: "💵 Cash on Delivery" },
                            { value: "easypaisa", label: "📱 EasyPaisa" },
                        ].map(m => (
                            <label
                                key={m.value}
                                className={`${styles.payMethod} ${form.paymentMethod === m.value ? styles.payMethodActive : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={m.value}
                                    checked={form.paymentMethod === m.value}
                                    onChange={handle}
                                />
                                {m.label}
                            </label>
                        ))}
                    </div>

                    {/* ── Card Details ── */}
                    {form.paymentMethod === "card" && (
                        <div className={styles.payFields}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Name on Card</label>
                                <input className={styles.input} name="cardName" placeholder="Abdul Moeez" value={form.cardName} onChange={handle} required />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Card Number</label>
                                <input className={styles.input} name="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={handle} required />
                            </div>
                            <div className={styles.formGrid2}>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Expiry</label>
                                    <input className={styles.input} name="expiry" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={handle} required />
                                </div>
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>CVV</label>
                                    <input className={styles.input} name="cvv" placeholder="123" maxLength={4} value={form.cvv} onChange={handle} required />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Cash on Delivery note ── */}
                    {form.paymentMethod === "cod" && (
                        <div className={styles.payFields}>
                            <div className={styles.codInfo}>
                                <span className={styles.codIcon}>💵</span>
                                <div>
                                    <p className={styles.codTitle}>Cash on Delivery Selected</p>
                                    <p className={styles.codDesc}>
                                        Pay when your order arrives. A handling fee of <strong>Rs 100</strong> has been added to your total.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── EasyPaisa Fields ── */}
                    {form.paymentMethod === "easypaisa" && (
                        <div className={styles.payFields}>
                            <div className={styles.epHeader}>
                                <span className={styles.epLogo}>📱</span>
                                <span className={styles.epTitle}>EasyPaisa Payment</span>
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Account Holder Name</label>
                                <input
                                    className={styles.input}
                                    name="easyName"
                                    placeholder="Abdul Moeez"
                                    value={form.easyName}
                                    onChange={handle}
                                    required
                                />
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>EasyPaisa Mobile Number</label>
                                <input
                                    className={styles.input}
                                    name="easyPhone"
                                    placeholder="03XX-XXXXXXX"
                                    maxLength={11}
                                    value={form.easyPhone}
                                    onChange={handle}
                                    required
                                />
                            </div>
                            <p className={styles.epNote}>
                                📌 You will receive a payment request on this number. Please confirm within 2 minutes to complete your order.
                            </p>
                        </div>
                    )}

                    <div className={styles.btnRow}>
                        <button
                            type="button"
                            className={styles.backBtnForm}
                            onClick={() => navigate(-1)}
                        >
                            <MdArrowBack size={18} /> Back
                        </button>
                        <button
                            className={styles.orderBtn}
                            type="submit"
                            disabled={cartItems.length === 0}
                        >
                            <MdShoppingCartCheckout size={20} />
                            Place Order — Rs {grand.toLocaleString()}
                        </button>
                    </div>

                </form>
            </div>

            {showSuccess && (
                <SuccessModal onClose={() => { clearCart(); setShowSuccess(false); navigate("/products"); }} />
            )}
        </div>
    );
};

export default Checkout;