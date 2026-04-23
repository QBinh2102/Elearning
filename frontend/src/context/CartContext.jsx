import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { addCartApi, clearCartApi, deleteCartApi, getCartApi } from "../services/cartApi";


const CartContext = createContext();

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const cartCount = cartItems.length;

    const fetchCart = async () => {
        if (!user) {
            setCartItems([]);
            setTotal(0);          
            setLoadingCart(false);
            return;
        }

        try {
            const res = await getCartApi();
            setCartItems(res.data.items);
            setTotal(res.data.total);
        } finally {
            setLoadingCart(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const addToCart = async (courseId) => {
        try {
            const res = await addCartApi({ course_id: courseId });

            setCartItems(res.data.items);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteFromCart = async (courseId) => {
        try {
            const res = await deleteCartApi(courseId);

            setCartItems(res.data.items);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        }
    };

    const clearCart = async () => {
        try {
            const res = await clearCartApi();
            setCartItems(res.data.items);
            setTotal(res.data.total);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <CartContext.Provider value={{ loadingCart, cartItems, total, cartCount, addToCart, deleteFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}