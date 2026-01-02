// Fixed categories for the application
// These are static categories that users can select from

export interface FixedCategory {
  id: number;
  nama_kategori: string;
}

export const FIXED_CATEGORIES: FixedCategory[] = [
  { id: 1, nama_kategori: "Makanan" },
  { id: 2, nama_kategori: "Minuman" },
  { id: 3, nama_kategori: "Lain-lain" },
  { id: 4, nama_kategori: "Sembako" },
];

// Helper function to get category name by id
export const getCategoryNameById = (id: number | null): string => {
  if (id === null) return "Semua";
  const category = FIXED_CATEGORIES.find((cat) => cat.id === id);
  return category ? category.nama_kategori : "Tidak Diketahui";
};
