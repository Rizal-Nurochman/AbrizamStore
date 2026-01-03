"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Package,
  Loader2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCreatePenjualan } from "@/hooks/useCreatePenjualan";
import { Product, POSCartItem } from "@/types";

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch products with search and pagination
  const { data: productsData, isLoading } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery
  });
  const products = productsData?.data || [];
  const totalProducts = productsData?.meta?.total_items || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const createPenjualan = useCreatePenjualan();

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.harga_jual * item.quantity), 0);
  }, [cart]);

  // Calculate cart items count
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Add product to cart
  const addToCart = (product: Product) => {
    if (product.stok <= 0) return;

    setCart(prev => {
      const existingItem = prev.find(item => item.product.ID === product.ID);
      if (existingItem) {
        // Check if we can add more
        if (existingItem.quantity >= product.stok) return prev;
        return prev.map(item =>
          item.product.ID === product.ID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.ID !== productId) return item;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stok) return item;
        return { ...item, quantity: newQty };
      }).filter(item => item.quantity > 0);
    });
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.ID !== productId));
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    try {
      await createPenjualan.mutateAsync({
        items: cart.map(item => ({
          id_produk: item.product.ID,
          jumlah: item.quantity,
        })),
      });

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Clear cart
      setCart([]);
      setShowMobileCart(false);
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Cart Content Component (reusable for desktop and mobile)
  const CartContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Cart Header */}
      <div className="p-4 md:p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Keranjang</h2>
              <p className="text-sm text-gray-500">{cart.length} item</p>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setShowMobileCart(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-gray-400"
            >
              <ShoppingCart className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-sm">Keranjang kosong</p>
              <p className="text-xs mt-1">Klik produk untuk menambahkan</p>
            </motion.div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.product.ID}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-gray-50 rounded-xl p-3 md:p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Product Image */}
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product.foto_produk ? (
                      <img
                        src={item.product.foto_produk}
                        alt={item.product.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 md:w-6 md:h-6 text-violet-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.product.nama_produk}
                    </h4>
                    <p className="text-violet-600 font-semibold text-sm">
                      {formatCurrency(item.product.harga_jual)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.product.ID)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.ID, -1)}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.ID, 1)}
                      disabled={item.quantity >= item.product.stok}
                      className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-gray-900">
                    {formatCurrency(item.product.harga_jual * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Cart Footer */}
      <div className="p-4 md:p-5 border-t border-gray-100 space-y-4">
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Total</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            {formatCurrency(cartTotal)}
          </span>
        </div>

        {/* Checkout Button */}
        <motion.button
          onClick={handleCheckout}
          disabled={cart.length === 0 || createPenjualan.isPending}
          whileHover={{ scale: cart.length > 0 ? 1.02 : 1 }}
          whileTap={{ scale: cart.length > 0 ? 0.98 : 1 }}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {createPenjualan.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Bayar Sekarang</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200">
          <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kasir (POS)</h1>
          <p className="text-xs md:text-sm text-gray-500">Catat penjualan barang</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-6 -mx-4 lg:-mx-8">
        {/* Product Selection Panel */}
        <div className="flex-1 px-4 lg:px-8">
          {/* Search */}
          <div className="relative mb-4 md:mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-16 h-16 mb-4" />
              <p>Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-24 md:pb-0">
              <AnimatePresence>
                {products.map((product) => {
                  const inCart = cart.find(item => item.product.ID === product.ID);
                  const isOutOfStock = product.stok <= 0;
                  const cartQty = inCart?.quantity || 0;
                  const availableStock = product.stok - cartQty;

                  return (
                    <motion.div
                      key={product.ID}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                      whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                      onClick={() => !isOutOfStock && availableStock > 0 && addToCart(product)}
                      className={`bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-gray-100 cursor-pointer transition-all ${isOutOfStock || availableStock <= 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-lg hover:border-violet-200"
                        } ${inCart ? "ring-2 ring-violet-500" : ""}`}
                    >
                      {/* Product Image or Icon */}
                      <div className="aspect-square rounded-lg md:rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-2 md:mb-3 overflow-hidden">
                        {product.foto_produk ? (
                          <img
                            src={product.foto_produk}
                            alt={product.nama_produk}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-8 h-8 md:w-12 md:h-12 text-violet-400" />
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="font-semibold text-gray-900 text-xs md:text-sm truncate mb-1">
                        {product.nama_produk}
                      </h3>
                      <p className="text-violet-600 font-bold text-xs md:text-sm">
                        {formatCurrency(product.harga_jual)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        Stok: {product.stok} {inCart && `(${cartQty})`}
                      </p>

                      {/* Add indicator */}
                      {!isOutOfStock && availableStock > 0 && (
                        <div className="mt-2 md:mt-3 flex items-center justify-center gap-1 text-violet-600 text-xs font-medium">
                          <Plus className="w-3 h-3" />
                          <span>Tambah</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 px-3">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop Cart Panel */}
        <div className="hidden md:block w-80 lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)] sticky top-32">
            <CartContent />
          </div>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-40">
        <motion.button
          onClick={() => setShowMobileCart(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg shadow-green-200 flex items-center justify-center text-white"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Mobile Cart Overlay */}
      <AnimatePresence>
        {showMobileCart && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileCart(false)}
              className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            {/* Cart Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 flex flex-col max-h-[85vh]"
            >
              <CartContent isMobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center mx-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transaksi Berhasil!</h3>
              <p className="text-gray-500">Penjualan telah dicatat</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
