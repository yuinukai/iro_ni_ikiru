'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Zap, PenTool, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'ほーむ', icon: Home, color: '#FF1493' },
  { href: '/articles/simple-production', label: 'きじいちらん', icon: Zap, color: '#32CD32' },
  { href: '/admin/simple-production', label: 'きじとうこう', icon: PenTool, color: '#1E90FF' },
];

export default function Navigation() {
  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* ロゴ */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-black press-start-2p-regular leading-tight"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                I run on 200% caffeine.
              </motion.div>
            </Link>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg font-bold text-black transition-colors"
                    >
                      <IconComponent size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* モバイルメニューボタン */}
            <motion.button
              className="md:hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg font-bold text-black transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
            >
              <span>☰</span>
            </motion.button>
          </div>

          {/* モバイルメニュー */}
          <div id="mobile-menu" className="hidden md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.05, x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg font-bold text-black w-full justify-start transition-colors"
                    >
                      <IconComponent size={24} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* フローティングナビゲーション（モバイル） */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href={item.href}
                    className="flex flex-col items-center p-2 rounded-lg text-black"
                  >
                    <IconComponent size={24} className="mb-1" />
                    <span className="text-xs font-bold">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}