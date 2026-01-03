"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2, Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Hapus Transaksi?",
  message = "Transaksi yang dihapus tidak dapat dikembalikan. Data ini akan dihapus secara permanen dari riwayat.",
}: ConfirmDeleteModalProps) {
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <p className="text-sm text-gray-500">Konfirmasi penghapusan</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/80 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">{message}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin melanjutkan?
                </p>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <motion.button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Hapus</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
