'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';
import { mainNavItems } from '@/data/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout, openLoginModal, isLoginModalOpen, closeLoginModal } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">ML Server</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted hover:text-foreground transition-colors text-sm font-medium"
                >
                  {item.labelKo}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button className="p-2 text-muted hover:text-foreground transition-colors">
                <Globe className="w-5 h-5" />
              </button>

              {/* Auth Buttons */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/mypage"
                    className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
                  >
                    마이페이지
                  </Link>
                  <span className="text-sm text-primary-400 hidden sm:block">
                    {user?.email}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm text-muted hover:text-foreground transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openLoginModal}
                    className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
                  >
                    로그인
                  </button>
                  <button
                    onClick={openLoginModal}
                    className="btn-primary text-sm py-1.5 px-3"
                  >
                    회원가입
                  </button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-muted hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-2">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted hover:text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-card"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.labelKo}
                  </Link>
                ))}
                {isAuthenticated && (
                  <Link
                    href="/mypage"
                    className="text-muted hover:text-foreground transition-colors py-2 px-4 rounded-lg hover:bg-card"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}
