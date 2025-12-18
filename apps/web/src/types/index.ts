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
