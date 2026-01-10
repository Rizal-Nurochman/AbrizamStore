"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BarChart3, Box, ShoppingCart, Zap, ShieldCheck, Heart, Menu, X, MessageCircle, TrendingUp } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans selection:bg-[var(--accent)]/20">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Calistoga&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ===== NAVBAR ===== */}
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="relative flex h-16 items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 px-6 backdrop-blur-xl shadow-sm">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-105">
                <Box className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold gradient-text">
                DODOLAN
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--muted-foreground)]">
              <Link href="#features" className="relative py-2 hover:text-[var(--foreground)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--accent)] after:transition-all hover:after:w-full">
                Fitur
              </Link>
              <Link href="#benefits" className="relative py-2 hover:text-[var(--foreground)] transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--accent)] after:transition-all hover:after:w-full">
                Keuntungan
              </Link>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent-lg)] active:scale-[0.98]"
              >
                Mulai Berjualan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-20 left-6 right-6 rounded-2xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-xl shadow-2xl p-6 md:hidden animate-fade-in z-50">
              <div className="flex flex-col space-y-2">
                <Link
                  href="#features"
                  className="px-4 py-3 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Fitur
                </Link>
                <Link
                  href="#benefits"
                  className="px-4 py-3 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Keuntungan
                </Link>

                <div className="h-px bg-[var(--border)] my-2"></div>

                <Link
                  href="/login"
                  className="px-4 py-3 text-base font-medium text-[var(--foreground)] hover:bg-[var(--muted)] rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="mt-2 w-full text-center rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all active:scale-[0.98]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mulai Berjualan
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-36 pb-24 lg:pt-48 lg:pb-36 overflow-hidden">
        {/* Aceternity Aurora Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -inset-[10px] opacity-30 blur-[60px] will-change-transform animate-aurora
              [background-image:repeating-linear-gradient(100deg,#0052FF_10%,#38bdf8_15%,#4D7CFF_20%,#a78bfa_25%,#0052FF_30%)]
              [background-size:300%_200%]
              [background-position:50%_50%]
              [mask-image:radial-gradient(ellipse_at_100%_0%,black_40%,transparent_80%)]
            "
          ></div>
        </div>

        <div className="mx-auto max-w-6xl px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left z-10">
              {/* Section Badge */}
              <div className="section-badge mb-8 animate-fade-in">
                <span className="section-badge-dot animate-pulse-dot"></span>
                <span className="section-badge-text">Solusi #1 untuk UMKM Modern</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-[2.75rem] leading-[1.1] tracking-tight text-[var(--foreground)] mb-6 animate-slide-up md:text-5xl lg:text-[3.5rem]">
                Kelola Bisnismu, <br className="hidden sm:block" />
                <span className="gradient-text gradient-underline inline-block">
                  Semudah Sentuhan Jari.
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-slide-up-delayed">
                Tingkatkan efisiensi bisnis Anda dengan sistem manajemen stok pintar,
                kasir digital, dan laporan keuangan otomatis. Semua dalam satu aplikasi.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slide-up-delayed" style={{ animationDelay: "0.3s" }}>
                <Link
                  href="/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[var(--accent)]/25 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-accent-lg)] active:scale-[0.98]"
                >
                  Mulai Sekarang
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right: Hero Graphic */}
            <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
              {/* Rotating Outer Ring - smaller */}
              <div className="absolute w-[420px] h-[420px] animate-rotate-slow">
                <svg className="w-full h-full" viewBox="0 0 420 420">
                  <circle
                    cx="210"
                    cy="210"
                    r="200"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="8 8"
                  />
                </svg>
              </div>

              {/* Main Gradient Circle */}
              <div className="absolute w-72 h-72 rounded-full bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-secondary)]/5 blur-sm"></div>

              {/* Center Dashboard Preview */}
              <div className="relative z-10 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden p-2 w-full max-w-[380px]">
                <Image
                  src="/images/dashboard-mockup.png"
                  alt="DODOLAN Dashboard"
                  width={800}
                  height={600}
                  className="rounded-xl w-full h-auto"
                  priority
                />
              </div>

              {/* Floating Card: Profit - positioned inside container */}
              <div className="absolute right-0 top-12 p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-xl shadow-[var(--accent)]/10 animate-float-slow z-20">
                <span className="flex items-center gap-2 font-semibold text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4" />
                  +24% Profit
                </span>
              </div>

              {/* Floating Card: Order - positioned inside container */}
              <div className="absolute left-0 bottom-24 p-3 bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-xl shadow-[var(--accent)]/10 animate-float-alt z-20">
                <span className="flex items-center gap-2 font-semibold text-[var(--accent)] text-sm">
                  <ShoppingCart className="h-4 w-4" />
                  Order Baru
                </span>
              </div>

              {/* Decorative Dots Grid - repositioned */}
              <div className="absolute bottom-4 right-8 grid grid-cols-3 gap-1.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/30"></div>
                ))}
              </div>

              {/* Corner Accent Block - smaller and repositioned */}
              <div className="absolute top-8 left-8 w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] shadow-lg shadow-[var(--accent)]/30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FILOSOFI DODOLAN ===== */}
      <section className="py-20 bg-[var(--muted)] relative overflow-hidden">
        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-[100px] pointer-events-none"></div>

        <div className="mx-auto max-w-6xl px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] mb-6 shadow-lg shadow-[var(--accent)]/30">
              <Box className="h-8 w-8 text-white" />
            </div>

            {/* Headline */}
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-4 md:text-4xl">
              Apa itu <span className="gradient-text">DODOLAN</span>?
            </h2>

            {/* Description */}
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
              <span className="font-semibold text-[var(--accent)]">&quot;Dodolan&quot;</span> berasal dari bahasa Jawa yang artinya <span className="font-semibold text-[var(--foreground)]">&quot;berjualan&quot;</span>.
              Filosofi ini mencerminkan semangat kami untuk membantu para pedagang dan pemilik usaha dalam mengelola bisnis mereka dengan mudah dan efisien.
              Dari warung kecil hingga toko besar, DODOLAN hadir sebagai partner digital Anda.
            </p>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-28 bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-6">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="section-badge mb-6 justify-center">
              <span className="section-badge-dot"></span>
              <span className="section-badge-text">Fitur Unggulan</span>
            </div>
            <h2 className="font-display text-3xl text-[var(--foreground)] mb-4 md:text-[2.5rem]">
              Semua yang Anda <span className="gradient-text">Butuhkan</span>
            </h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              Fitur lengkap untuk membantu operasional warung Anda berjalan lebih lancar dan menguntungkan.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Manajemen Stok */}
            <div className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/5 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-110">
                  <Box className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Manajemen Stok</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Pantau stok barang real-time. Dapatkan notifikasi saat barang hampir habis agar tidak pernah kehilangan penjualan.
                </p>
              </div>
            </div>

            {/* Feature 2: Laporan Keuangan - Wide */}
            <div className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/5 hover:-translate-y-1 md:col-span-2 overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center h-full relative">
                <div className="flex-1">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-110">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Laporan Keuangan</h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    Analisis keuntungan harian, mingguan, hingga bulanan secara otomatis.
                    Ambil keputusan bisnis berdasarkan data yang akurat.
                  </p>
                </div>
                {/* Visual: Bar Chart */}
                <div className="hidden md:flex w-1/3 h-32 items-end justify-between gap-2 p-4 bg-[var(--muted)] rounded-xl opacity-80 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full bg-[var(--accent)]/20 rounded-t h-[40%]"></div>
                  <div className="w-full bg-[var(--accent)]/30 rounded-t h-[70%]"></div>
                  <div className="w-full bg-[var(--accent)]/25 rounded-t h-[50%]"></div>
                  <div className="w-full bg-[var(--accent)]/40 rounded-t h-[85%]"></div>
                  <div className="w-full bg-[var(--accent)]/35 rounded-t h-[60%]"></div>
                </div>
              </div>
            </div>

            {/* Feature 3: Kasir Cepat - Wide */}
            <div className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/5 hover:-translate-y-1 md:col-span-2 overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center h-full relative">
                {/* Visual: Receipt */}
                <div className="hidden md:flex w-1/3 h-32 flex-col gap-2 p-3 bg-[var(--muted)] rounded-xl opacity-80 group-hover:scale-105 transition-transform duration-500 rotate-2">
                  <div className="w-3/4 h-3 bg-[var(--border)] rounded"></div>
                  <div className="w-1/2 h-3 bg-[var(--border)] rounded"></div>
                  <div className="w-full h-px bg-[var(--border)] my-1"></div>
                  <div className="flex justify-between">
                    <div className="w-1/3 h-2 bg-[var(--border)] rounded"></div>
                    <div className="w-1/4 h-2 bg-[var(--border)] rounded"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/3 h-2 bg-[var(--border)] rounded"></div>
                    <div className="w-1/4 h-2 bg-[var(--border)] rounded"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-110">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Kasir Cepat</h3>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    Proses transaksi super cepat dengan barcode scanner support.
                    Cetak struk belanja atau kirim struk digital via WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4: Aman & Terpercaya */}
            <div className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent)]/5 hover:-translate-y-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Aman & Terpercaya</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Data Anda disimpan dengan enkripsi tingkat tinggi. Backup otomatis setiap hari agar Anda tenang.
                </p>
              </div>
            </div>

            {/* Feature 5: AI Chatbot - Featured */}
            <div className="group md:col-span-3">
              <div className="gradient-border">
                <div className="gradient-border-inner p-8 relative overflow-hidden">
                  <div className="absolute inset-0 rounded-[calc(1rem-2px)] bg-gradient-to-br from-[var(--accent)]/[0.02] to-transparent"></div>
                  <div className="flex flex-col md:flex-row gap-8 items-center relative">
                    <div className="flex-1">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/25 transition-transform group-hover:scale-110">
                        <MessageCircle className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Asisten AI Cerdas</h3>
                      <p className="text-[var(--muted-foreground)] leading-relaxed">
                        Chatbot AI yang siap membantu menganalisis data bisnis Anda. Tanyakan performa penjualan, produk terlaris, kondisi stok, dan insight bisnis lainnya dalam bahasa yang mudah dipahami.
                      </p>
                    </div>
                    {/* Visual: Chat Bubbles */}
                    <div className="hidden md:flex w-1/3 flex-col gap-3 p-4 bg-[var(--muted)] rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-500">
                      <div className="self-end bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%]">
                        Produk apa yang paling laku?
                      </div>
                      <div className="self-start bg-[var(--card)] text-[var(--foreground)] text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[85%] border border-[var(--border)]">
                        Produk terlaris adalah Indomie dengan 150 unit terjual 📊
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BENEFITS SECTION (INVERTED DARK) ===== */}
      <section id="benefits" className="py-28 relative overflow-hidden bg-[var(--foreground)]">
        {/* Dot Pattern Texture */}
        <div className="absolute inset-0 dot-pattern"></div>

        {/* Radial Glows */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[150px]"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[var(--accent-secondary)] opacity-[0.04] blur-[150px]"></div>

        <div className="mx-auto max-w-6xl px-6 relative">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse-dot"></span>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/70">
                Keuntungan
              </span>
            </div>
            <h2 className="font-display text-3xl text-white mb-4 md:text-[2.5rem]">
              Didesain untuk <span className="gradient-text">Kenyamanan</span> Anda
            </h2>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20 transition-all group-hover:bg-white/15 group-hover:scale-105">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">User Friendly</h3>
              <p className="text-white/70 leading-relaxed">
                Tampilan antarmuka yang bersih dan mudah dipahami, bahkan bagi pengguna baru sekalipun.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20 transition-all group-hover:bg-white/15 group-hover:scale-105">
                <span className="text-2xl font-bold">24/7</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Support Prioritas</h3>
              <p className="text-white/70 leading-relaxed">
                Tim support kami siap membantu kapan saja Anda mengalami kendala operasional.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20 transition-all group-hover:bg-white/15 group-hover:scale-105">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Setup Instan</h3>
              <p className="text-white/70 leading-relaxed">
                Hanya butuh 2 menit untuk mendaftar dan mulai berjualan. Tanpa instalasi rumit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[var(--card)] py-12 border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-secondary)] text-white">
              <Box className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-[var(--foreground)]">DODOLAN</span>
          </div>

          {/* Copyright */}
          <p className="text-sm text-[var(--muted-foreground)]">
            &copy; {new Date().getFullYear()} DODOLAN. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
