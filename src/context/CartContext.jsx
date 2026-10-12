
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'velox-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const incoming = action.payload;

      const existing = state.find(
        (item) =>
          item.id === incoming.id &&
          item.size === incoming.size
      );

      if (existing) {
        return state.map((item) =>
          item.id === incoming.id &&
          item.size === incoming.size
            ? {
                ...item,
                quantity: item.quantity + incoming.quantity,
              }
            : item
        );
      }

      return [...state, incoming];
    }

    case 'REMOVE_ITEM':
      return state.filter(
        (item) =>
          !(
            item.id === action.payload.id &&
            item.size === action.payload.size
          )
      );

    case 'UPDATE_QUANTITY':
      return state.map((item) => {
        if (
          item.id === action.payload.id &&
          item.size === action.payload.size
        ) {
          return {
            ...item,
            quantity: Math.max(1, action.payload.quantity),
          };
        }

        return item;
      });

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    loadCart
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Cart remains available during this session.
    }
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        image: `/images/products/${product.id}/velox-v1-${product.id}-hero.png`,
        colorway: product.colorway,
        accent: product.accent,
        price: product.price,
        size,
        quantity,
      },
    });
  };

  const removeFromCart = (id, size) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, size },
    });
  };

  const updateQuantity = (id, size, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, size, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
    }),
    [cart, totalItems, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
