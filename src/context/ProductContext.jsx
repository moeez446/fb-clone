import { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/Productsdata';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(PRODUCTS);

    const addProduct = useCallback((product) => {
        const newProduct = {
            ...product,
            id: Date.now(),
            rating: parseFloat(product.rating) || 4.0,
            reviews: parseInt(product.reviews) || 0,
            price: parseInt(product.price) || 0,
        };
        setProducts(prev => [newProduct, ...prev]);
    }, []);

    const updateProduct = useCallback((id, updated) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? {
                ...p,
                ...updated,
                rating: parseFloat(updated.rating) || p.rating,
                reviews: parseInt(updated.reviews) || p.reviews,
                price: parseInt(updated.price) || p.price,
            } : p
        ));
    }, []);

    const deleteProduct = useCallback((id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);