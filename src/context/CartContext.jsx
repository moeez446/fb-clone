import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

const CART_KEY = 'fb_cart_items';

const loadCart = () => {
    try {
        const saved = localStorage.getItem(CART_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => loadCart());
    const [toasts, setToasts] = useState([]);

    /* ── Sync cart to localStorage on every change ── */
    useEffect(() => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        } catch { }
    }, [cartItems]);

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
                    item.id === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
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

    /* ── Clear cart after successful order ── */
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQty, clearCart,
            totalCount, totalPrice,
            toasts, removeToast,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);