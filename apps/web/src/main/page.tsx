"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Produk {
  ID: number;
  nama_produk: string;
  harga_jual: number;
  stok: number;
}

interface CartItem {
  id_produk: number;
  nama_produk: string; 
  harga_jual: number;  
  jumlah: number;
}

export default function KasirPage() {
  const [produks, setProduks] = useState<Produk[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async (query: string) => {
    const endpoint = query ? `/products?nama_produk=${query}` : '/products';
    const response = await api.get(endpoint);
    if (response.status) {
      setProduks(response.data.produks);
    }
  };

  useEffect(() => {
    fetchProducts(search);
  }, [search]);

  const addToCart = (produk: Produk) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id_produk === produk.ID);
      if (existing) {
        return prevCart.map(item =>
          item.id_produk === produk.ID ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      }
      return [...prevCart, { 
        id_produk: produk.ID, 
        nama_produk: produk.nama_produk,
        harga_jual: produk.harga_jual,
        jumlah: 1 
      }];
    });
  };

  // Fungsi untuk checkout
  const handleCheckout = async () => {
    // Format cart sesuai DTO PenjualanCreate
    const payload = {
      items: cart.map(item => ({
        id_produk: item.id_produk,
        jumlah: item.jumlah
      }))
    };
    
    try {
      // Panggil API Penjualan Anda
      const response = await api.post('/penjualan', payload);
      if (response.status) {
        alert('Transaksi Berhasil!');
        setCart([]); // Kosongkan keranjang
        fetchProducts(""); // Refresh data stok produk
      } else {
        alert(`Error: ${response.message}`); // Misal: "stok tidak cukup"
      }
    } catch (err) {
      alert(`Error: ${err}`);
    }
  };
  
  const totalBelanja = cart.reduce((sum, item) => sum + (item.harga_jual * item.jumlah), 0);

  return (
    <div style={{ display: 'flex' }}>
      {/* Kolom Daftar Produk */}
      <div style={{ width: '60%' }}>
        <h2>Daftar Produk</h2>
        <input 
          type="text" 
          placeholder="Cari nama produk..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <hr />
        {produks.map(produk => (
          <div key={produk.ID} style={{ border: '1px solid #ccc', margin: '5px', padding: '5px' }}>
            <p>{produk.nama_produk}</p>
            <p>Rp {produk.harga_jual} (Stok: {produk.stok})</p>
            <button onClick={() => addToCart(produk)} disabled={produk.stok === 0}>
              + Tambah
            </button>
          </div>
        ))}
      </div>

      {/* Kolom Keranjang Belanja */}
      <div style={{ width: '40%', paddingLeft: '20px' }}>
        <h2>Keranjang</h2>
        {cart.map(item => (
          <div key={item.id_produk}>
            <p>{item.nama_produk} (x{item.jumlah})</p>
            <p>Rp {item.harga_jual * item.jumlah}</p>
          </div>
        ))}
        <hr />
        <h3>Total: Rp {totalBelanja}</h3>
        <button onClick={handleCheckout} disabled={cart.length === 0}>
          Checkout (Bayar)
        </button>
      </div>
    </div>
  );
}