import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_KEY   = 'fb_cart_items';
const ORDERS_KEY = 'fb_orders';

const loadCart = () => {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
};

const loadOrders = () => {
    try {
        const saved = localStorage.getItem(ORDERS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => loadCart());
    const [orders, setOrders]       = useState(() => loadOrders());
    const [toasts, setToasts]       = useState([]);

    /* ── Persist cart ── */
    useEffect(() => {
        try { localStorage.setItem(CART_KEY, JSON.stringify(cartItems)); } catch {}
    }, [cartItems]);

    /* ── Persist orders ── */
    useEffect(() => {
        try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch {}
    }, [orders]);

    /* ── Toast helpers ── */
    const addToast = useCallback((name) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, name }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    /* ── Cart helpers ── */
    const addToCart = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
        addToast(product.name);
    }, [addToast]);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const updateQty = useCallback((id, qty) => {
        if (qty < 1) return;
        setCartItems(prev =>
            prev.map(item => item.id === id ? { ...item, qty } : item)
        );
    }, []);

    /* ── Place order — saves to orders history ── */
    const placeOrder = useCallback((formData, cartItems, total) => {
        const order = {
            id: `ORD-${Date.now()}`,
            date: new Date().toLocaleString('en-PK', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            }),
            items: cartItems.map(i => ({ ...i })),
            total,
            customer: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
            payment: formData.paymentMethod,
            status: 'Pending',
        };
        setOrders(prev => [order, ...prev]);
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const updateOrderStatus = useCallback((orderId, status) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status } : o
        ));
    }, []);

    const deleteOrder = useCallback((orderId) => {
        setOrders(prev => prev.filter(o => o.id !== orderId));
    }, []);

    const cancelOrder = useCallback((orderId, reason) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: 'Cancelled', cancelReason: reason, cancelledAt: new Date().toLocaleString('en-PK') } : o
        ));
    }, []);

    const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQty, clearCart,
            totalCount, totalPrice,
            orders, placeOrder, updateOrderStatus, cancelOrder, deleteOrder,
            toasts, removeToast,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);