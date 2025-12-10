"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BarChart3, Box, ShoppingCart, Zap, ShieldCheck, Heart, Menu, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6">
          <div className="relative flex h-20 items-center justify-between rounded-b-2xl bg-white/70 px-6 backdrop-blur-xl border-b border-white/20 shadow-sm dark:bg-zinc-900/70 dark:border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Box className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Warungku
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              <Link href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fitur</Link>
              <Link href="#benefits" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Keuntungan</Link>

            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 transition-all active:scale-95"
              >
                Buat Akun Warung
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-zinc-600 dark:text-zinc-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-24 left-6 right-6 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl p-6 md:hidden animate-fade-in z-50">
              <div className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="px-4 py-2 text-base font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link
                  href="#benefits"
                  className="px-4 py-2 text-base font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Keuntungan
                </Link>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2"></div>
                <Link
                  href="/login"
                  className="px-4 py-2 text-base font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all active:scale-95"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Buat Akun Warung
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -ml-[40rem] -mt-16 w-[40rem] h-[40rem] rounded-full bg-purple-500/30 mix-blend-multiply blur-3xl animate-blob dark:bg-purple-900/20"></div>
        <div className="absolute top-0 right-1/2 -mr-[40rem] -mt-16 w-[40rem] h-[40rem] rounded-full bg-indigo-500/30 mix-blend-multiply blur-3xl animate-blob animation-delay-2000 dark:bg-indigo-900/20"></div>
        <div className="absolute -bottom-32 left-1/2 -ml-20 w-[40rem] h-[40rem] rounded-full bg-pink-500/30 mix-blend-multiply blur-3xl animate-blob animation-delay-4000 dark:bg-pink-900/20"></div>

        <div className="container relative mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 bg-transparent text-center lg:text-left z-10">
              <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-400 mb-6 animate-fade-in">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                Solusi #1 untuk Warung Modern
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 leading-tight animate-slide-up">
                Kelola Warung Impianmu, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  Semudah Sentuhan Jari.
                </span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8 max-w-2xl mx-auto lg:mx-0 animate-slide-up-delayed leading-relaxed">
                Tingkatkan efisiensi warung Anda dengan sistem manajemen stok pintar,
                kasir digital, dan laporan keuangan otomatis. Semua dalam satu aplikasi.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up-delayed" style={{ animationDelay: "0.4s" }}>
                <Link
                  href="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-105 transition-all"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-5 w-5" />
                </Link>

              </div>
            </div>

            <div className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-[600px] animate-float">
                {/* Main Dashboard Mockup */}
                <div className="relative z-10 rounded-2xl bg-white border border-white/20 shadow-2xl overflow-hidden glass-card p-2 dark:bg-zinc-900/50">
                  <Image
                    src="/images/dashboard-mockup.png"
                    alt="Warungku Dashboard"
                    width={800}
                    height={600}
                    className="rounded-xl w-full h-auto"
                    priority
                  />
                  {/* Floating Elements */}
                  <div className="absolute -right-8 -top-8 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-xl shadow-indigo-500/20 animate-bounce delay-700 hidden md:block">
                    <span className="flex items-center gap-2 font-bold text-green-500">
                      <Zap className="h-5 w-5" /> +24% Profit
                    </span>
                  </div>
                  <div className="absolute -left-8 -bottom-8 p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-xl shadow-purple-500/20 animate-pulse hidden md:block">
                    <span className="flex items-center gap-2 font-bold text-indigo-500">
                      <ShoppingCart className="h-5 w-5" /> Order Baru
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (Bento Grid) */}
      <section id="features" className="py-24 bg-white dark:bg-zinc-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Fitur lengkap untuk membantu operasional warung Anda berjalan lebih lancar dan menguntungkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Box className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Manajemen Stok</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Pantau stok barang real-time. Dapatkan notifikasi saat barang hampir habis agar tidak pernah kehilangan penjualan.
              </p>
            </div>

            {/* Feature 2: Laporan Keuangan */}
            <div className="group relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all hover:-translate-y-1 md:col-span-2 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1 z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Laporan Keuangan</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Analisis keuntungan harian, mingguan, hingga bulanan secara otomatis.
                    Ambil keputusan bisnis berdasarkan data yang akurat.
                  </p>
                </div>
                {/* Visual: CSS Bar Chart */}
                <div className="hidden md:flex w-1/3 h-32 items-end justify-between gap-2 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm opacity-80 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full bg-indigo-100 dark:bg-indigo-900/30 rounded-t-sm h-[40%] animate-pulse" style={{ animationDelay: '0s' }}></div>
                  <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-t-sm h-[70%] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-full bg-pink-100 dark:bg-pink-900/30 rounded-t-sm h-[50%] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div className="w-full bg-indigo-200 dark:bg-indigo-800/50 rounded-t-sm h-[85%] animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  <div className="w-full bg-purple-200 dark:bg-purple-800/50 rounded-t-sm h-[60%] animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                </div>
              </div>
            </div>

            {/* Feature 3: Kasir Cepat */}
            <div className="group relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 hover:shadow-2xl hover:shadow-pink-500/10 transition-all hover:-translate-y-1 md:col-span-2 overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                {/* Visual: CSS Receipt List */}
                <div className="hidden md:flex w-1/3 h-32 flex-col gap-2 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm opacity-80 group-hover:scale-105 transition-transform duration-500 rotate-2">
                  <div className="w-3/4 h-3 bg-zinc-100 dark:bg-zinc-700 rounded animate-pulse"></div>
                  <div className="w-1/2 h-3 bg-zinc-100 dark:bg-zinc-700 rounded animate-pulse delay-75"></div>
                  <div className="w-full h-px bg-zinc-100 dark:bg-zinc-700 my-1"></div>
                  <div className="flex justify-between">
                    <div className="w-1/3 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                    <div className="w-1/4 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/3 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                    <div className="w-1/4 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/3 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                    <div className="w-1/4 h-2 bg-zinc-100 dark:bg-zinc-700 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Kasir Cepat</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Proses transaksi super cepat dengan barcode scanner support.
                    Cetak struk belanja atau kirim struk digital via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 hover:shadow-2xl hover:shadow-orange-500/10 transition-all hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Aman & Terpercaya</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Data Anda disimpan dengan enkripsi tingkat tinggi. Backup otomatis setiap hari agar Anda tenang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-900 dark:bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-90"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-12">
            Didesain untuk Kenyamanan Anda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">User Friendly</h3>
              <p className="text-indigo-100">
                Tampilan antarmuka yang bersih dan mudah dipahami, bahkan bagi pengguna baru sekalipun.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20">
                <span className="text-2xl font-bold">24/7</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Support Prioritas</h3>
              <p className="text-indigo-100">
                Tim support kami siap membantu kapan saja Anda mengalami kendala operasional.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Setup Instan</h3>
              <p className="text-indigo-100">
                Hanya butuh 2 menit untuk mendaftar dan mulai berjualan. Tanpa instalasi rumit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-950 py-12 border-t border-zinc-100 dark:border-zinc-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Box className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-white">Warungku</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} Warungku. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
