'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import BlockChar from '@/components/BlockChar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white text-black flex items-center justify-center pt-20">
        <div className="text-center">
          <motion.h1 
            className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-8 text-black press-start-2p-regular px-4 leading-tight"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <span className="block">Maybe...</span>
            <span className="block">I'm just pure color,</span>
            <span className="block">'cause damn, I glow.</span>
          </motion.h1>
          
          <motion.div 
            className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 px-4 classical-japanese"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="leading-relaxed">
              <span className="block">拙者、色そのものなり</span>
              <span className="block">かくも輝きを放つゆえ</span>
              <span className="block">知らんけど...</span>
            </div>
          </motion.div>
          
          {/* ソーシャルメディアボタン */}
          <motion.div 
            className="mt-8 sm:mt-12 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
              {/* YouTube ボタン */}
              <motion.button
                onClick={() => {
                  // チャンネル作成後にURLを更新
                  alert('YouTubeチャンネルは準備中です！');
                }}
                className="w-full sm:w-auto press-start-2p-button text-sm rounded-lg transition-all duration-200 social-button-youtube"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                YouTube
              </motion.button>

              {/* Instagram ボタン */}
              <motion.button
                onClick={() => {
                  // Instagramアカウント作成後にURLを更新
                  alert('Instagramアカウントは準備中です！');
                }}
                className="w-full sm:w-auto press-start-2p-button text-sm rounded-lg transition-all duration-200 social-button-instagram"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Instagram
              </motion.button>

              {/* Post ボタン */}
              <Link href="/articles">
                <motion.button
                  className="w-full sm:w-auto press-start-2p-button text-sm rounded-lg transition-all duration-200 social-button-post"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Post
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
        </div>
      </div>
    </>
  );
}