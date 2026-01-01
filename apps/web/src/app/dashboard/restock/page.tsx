"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Plus,
  Minus,
  Trash2,
  PackagePlus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCreatePembelian } from "@/hooks/useCreatePembelian";
import { Product, RestockCartItem } from "@/types";

export default function RestockPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<RestockCartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Fetch products with search
  const { data: productsData, isLoading } = useProducts({
    page: 1,
    limit: 100,
    search: searchQuery
  });
  const products = productsData?.data || [];

  const createPembelian = useCreatePembelian();

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.buyPrice * item.quantity), 0);
  }, [cart]);

  // Calculate cart items count
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.ID === product.ID);
      if (existingItem) {
        return prev.map(item =>
          item.product.ID === product.ID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Use existing harga_beli as default
      return [...prev, { product, quantity: 1, buyPrice: product.harga_beli }];
    });
  };

  // Update quantity
  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.ID !== productId) return item;
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        return { ...item, quantity: newQty };
      }).filter(item => item.quantity > 0);
    });
  };

  // Update buy price
  const updateBuyPrice = (productId: number, price: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.ID !== productId) return item;
        return { ...item, buyPrice: Math.max(0, price) };
      });
    });
  };

  // Remove from cart
  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.ID !== productId));
  };

  // Handle submit restock
  const handleSubmit = async () => {
    if (cart.length === 0) return;

    // Validate prices
    const hasInvalidPrice = cart.some(item => item.buyPrice <= 0);
    if (hasInvalidPrice) {
      alert("Semua item harus memiliki harga beli > 0");
      return;
    }

    try {
      await createPembelian.mutateAsync({
        items: cart.map(item => ({
          id_produk: item.product.ID,
          jumlah: item.quantity,
          harga_beli: item.buyPrice,
        })),
      });

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Clear cart
      setCart([]);
      setShowMobileCart(false);
    } catch (error) {
      console.error("Restock failed:", error);
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
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <PackagePlus className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Daftar Restock</h2>
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
              <PackagePlus className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-sm">Belum ada item restock</p>
              <p className="text-xs mt-1">Klik &quot;Tambah&quot; pada produk</p>
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
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.product.foto_produk ? (
                      <img
                        src={item.product.foto_produk}
                        alt={item.product.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-5 h-5 md:w-6 md:h-6 text-orange-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {item.product.nama_produk}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Stok saat ini: {item.product.stok}
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

                {/* Quantity & Price Controls */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {/* Quantity */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Jumlah</label>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.ID, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.ID, 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Buy Price */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Harga Beli</label>
                    <div className="relative">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                      <input
                        type="number"
                        value={item.buyPrice || ""}
                        onChange={(e) => updateBuyPrice(item.product.ID, parseInt(e.target.value) || 0)}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="w-full pl-7 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(item.buyPrice * item.quantity)}
                  </span>
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
          <span className="text-gray-600 font-medium">Total Pembelian</span>
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            {formatCurrency(cartTotal)}
          </span>
        </div>

        {/* Submit Button */}
        <motion.button
          onClick={handleSubmit}
          disabled={cart.length === 0 || createPembelian.isPending}
          whileHover={{ scale: cart.length > 0 ? 1.02 : 1 }}
          whileTap={{ scale: cart.length > 0 ? 0.98 : 1 }}
          className="w-full py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {createPembelian.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <PackagePlus className="w-5 h-5" />
              <span>Simpan Restock</span>
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
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-200">
          <PackagePlus className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Restock Barang</h1>
          <p className="text-xs md:text-sm text-gray-500">Catat pembelian dari supplier</p>
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
              placeholder="Cari produk untuk restock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow shadow-sm"
            />
          </div>

          {/* Products List */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-16 h-16 mb-4" />
              <p>Tidak ada produk ditemukan</p>
            </div>
          ) : (
            <div className="space-y-3 pb-24 md:pb-0">
              <AnimatePresence>
                {products.map((product) => {
                  const inCart = cart.find(item => item.product.ID === product.ID);

                  return (
                    <motion.div
                      key={product.ID}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`bg-white rounded-xl p-3 md:p-4 shadow-sm border transition-all ${inCart ? "border-orange-300 ring-2 ring-orange-100" : "border-gray-100 hover:border-orange-200"
                        }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        {/* Product Image */}
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {product.foto_produk ? (
                            <img
                              src={product.foto_produk}
                              alt={product.nama_produk}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 md:w-7 md:h-7 text-orange-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {product.nama_produk}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-1 text-xs md:text-sm">
                            <span className="text-gray-500">
                              Stok: <span className={product.stok < 10 ? "text-red-500 font-semibold" : "text-gray-700"}>{product.stok}</span>
                            </span>
                            <span className="text-gray-500 hidden sm:inline">
                              Harga Beli: <span className="text-gray-700">{formatCurrency(product.harga_beli)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Add Button */}
                        <motion.button
                          onClick={() => addToCart(product)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-3 md:px-4 py-2 rounded-xl font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 transition-colors ${inCart
                            ? "bg-orange-100 text-orange-700"
                            : "bg-orange-500 text-white hover:bg-orange-600"
                            }`}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">{inCart ? "Tambah Lagi" : "Tambah"}</span>
                        </motion.button>
                      </div>

                      {/* Low stock warning */}
                      {product.stok < 10 && (
                        <div className="mt-2 md:mt-3 flex items-center gap-2 text-amber-600 text-xs">
                          <AlertCircle className="w-4 h-4" />
                          <span>Stok rendah, perlu restock</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Desktop Cart Panel */}
        <div className="hidden md:block w-96 lg:w-[420px] flex-shrink-0">
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
          className="relative w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full shadow-lg shadow-orange-200 flex items-center justify-center text-white"
        >
          <PackagePlus className="w-6 h-6" />
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Restock Berhasil!</h3>
              <p className="text-gray-500">Stok produk telah diperbarui</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
