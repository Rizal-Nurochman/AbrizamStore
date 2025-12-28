export interface Product {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  nama_produk: string;
  harga_beli: number;
  harga_jual: number;
  stok: number;
  id_kategori: number;
  foto_produk?: string;
}

export interface Category {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  nama_kategori: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    limit: number;
    total_items: number;
    total_page: number;
  };
}

// Cart item for POS (penjualan)
export interface POSCartItem {
  product: Product;
  quantity: number;
}

// Restock item for pembelian
export interface RestockCartItem {
  product: Product;
  quantity: number;
  buyPrice: number;
}

// Detail Penjualan
export interface DetailPenjualan {
  ID: number;
  id_produk: number;
  id_penjualan: number;
  harga_jual: number;
  jumlah: number;
  subtotal: number;
}

// Detail Pembelian
export interface DetailPembelian {
  ID: number;
  id_produk: number;
  id_pembelian: number;
  harga_beli: number;
  jumlah: number;
  subtotal: number;
}

// Penjualan (Sale)
export interface Penjualan {
  ID: number;
  CreatedAt: string;
  total_penjualan: number;
  id_user: number;
  DetailPenjualan?: DetailPenjualan[];
}

// Pembelian (Purchase/Restock)
export interface Pembelian {
  ID: number;
  CreatedAt: string;
  total_pembelian: number;
  id_user: number;
  DetailPembelian?: DetailPembelian[];
}

// User Profile
export interface User {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
  is_verified: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  profile_image?: string;
}
