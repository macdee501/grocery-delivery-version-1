import { create } from "zustand";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image_url: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    increaseQty: (id: string) => void;
    decreaseQty: (id: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    
    addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        
        if (existing) {
            // Item exists, increase quantity
            set({
                items: get().items.map((i) =>
                    i.id === item.id 
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            });
        } else {
            // New item, add to cart
            set({
                items: [...get().items, { ...item, quantity: 1 }],
            });
        }
    },
    
    removeItem: (id) => {
        set({
            items: get().items.filter((i) => i.id !== id),
        });
    },
    
    increaseQty: (id) => {
        set({
            items: get().items.map((i) =>
                i.id === id 
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
            ),
        });
    },
    
    decreaseQty: (id) => {
        set({
            items: get()
                .items.map((i) =>
                    i.id === id 
                        ? { ...i, quantity: i.quantity - 1 }
                        : i
                )
                .filter((i) => i.quantity > 0), // Remove if quantity reaches 0
        });
    },
    
    clearCart: () => set({ items: [] }),
    
    getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    
    getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.quantity * item.price, 0),
}));