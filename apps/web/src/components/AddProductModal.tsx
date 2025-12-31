"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Package, ImageIcon } from "lucide-react";
import { FIXED_CATEGORIES } from "@/constants/categories";
import { useCreateProduct } from "@/hooks/useCreateProduct";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type StockMode = "satuan" | "dus";

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [namaProduk, setNamaProduk] = useState("");
  const [hargaBeli, setHargaBeli] = useState<number>(0);
  const [hargaJual, setHargaJual] = useState<number>(0);
  const [kategoriId, setKategoriId] = useState<number | null>(null);
  const [stockMode, setStockMode] = useState<StockMode>("satuan");
  const [stokSatuan, setStokSatuan] = useState<string>("");
  const [isiPerDus, setIsiPerDus] = useState<string>("");
  const [jumlahDus, setJumlahDus] = useState<string>("");

  // Hooks
  const createProduct = useCreateProduct();

  // Calculate total stock
  const totalStock = stockMode === "satuan"
    ? (parseInt(stokSatuan) || 0)
    : (parseInt(isiPerDus) || 0) * (parseInt(jumlahDus) || 0);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setNamaProduk("");
      setHargaBeli(0);
      setHargaJual(0);
      setKategoriId(null);
      setStockMode("satuan");
      setStokSatuan("");
      setIsiPerDus("");
      setJumlahDus("");
    }
  }, [isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaProduk.trim()) return;

    try {
      await createProduct.mutateAsync({
        nama_produk: namaProduk,
        harga_beli: hargaBeli,
        harga_jual: hargaJual,
        stok: totalStock,
        kategori_id: kategoriId,
        foto_produk: imagePreview || undefined,
      });

      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Tambah Barang</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form - Scrollable */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Produk <span className="text-gray-400">(opsional)</span>
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-violet-300 transition-colors cursor-pointer bg-gray-50/50"
                  >
                    {imagePreview ? (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-md hover:bg-white"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-sm">Klik untuk upload foto</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Nama Produk */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={namaProduk}
                    onChange={(e) => setNamaProduk(e.target.value)}
                    placeholder="Masukkan nama produk"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                    required
                  />
                </div>

                {/* Harga Beli & Harga Jual */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Beli <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={hargaBeli || ""}
                        onChange={(e) => setHargaBeli(Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Jual <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                      <input
                        type="number"
                        min="0"
                        value={hargaJual || ""}
                        onChange={(e) => setHargaJual(Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={kategoriId ?? ""}
                    onChange={(e) => setKategoriId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow bg-white"
                  >
                    <option value="">Pilih Kategori</option>
                    {FIXED_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode Stok
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stockMode"
                        value="satuan"
                        checked={stockMode === "satuan"}
                        onChange={() => setStockMode("satuan")}
                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">Satuan (Pcs)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stockMode"
                        value="dus"
                        checked={stockMode === "dus"}
                        onChange={() => setStockMode("dus")}
                        className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                      />
                      <span className="text-sm text-gray-700">Dus</span>
                    </label>
                  </div>
                </div>

                {/* Stock Input */}
                <AnimatePresence mode="wait">
                  {stockMode === "satuan" ? (
                    <motion.div
                      key="satuan"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jumlah Stok
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          value={stokSatuan}
                          onChange={(e) => setStokSatuan(e.target.value)}
                          placeholder="Masukkan jumlah satuan"
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">pcs</span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="dus"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Isi per Dus
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              value={isiPerDus}
                              onChange={(e) => setIsiPerDus(e.target.value)}
                              placeholder="Masukkan isi per dus"
                              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">pcs</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jumlah Dus
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              value={jumlahDus}
                              onChange={(e) => setJumlahDus(e.target.value)}
                              placeholder="Masukkan jumlah dus"
                              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">dus</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Display */}
                      <div className="bg-violet-50 rounded-xl p-4 flex items-center justify-between">
                        <span className="text-sm font-medium text-violet-700">Total Stok:</span>
                        <span className="text-lg font-bold text-violet-600">
                          {totalStock.toLocaleString()} pcs
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={createProduct.isPending || !namaProduk.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createProduct.isPending ? "Menyimpan..." : "Tambah Produk"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
