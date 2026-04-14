'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isAuthenticated, getNavigationSettings } from '@/lib/api';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface NavLink {
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  isDropdown: boolean;
}

interface NavigationSettings {
  navLinks: NavLink[];
  showServicesDropdown: boolean;
  servicesDropdownLabel: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  showCtaButton: boolean;
  mobileMenuType: string;
  activeIndicatorStyle: string;
}

// Default fallback
const DEFAULT_NAV_LINKS = [
  { label: 'Beranda', href: '/', order: 1, isActive: true, isDropdown: false },
  { label: 'Layanan', href: '/services', order: 2, isActive: true, isDropdown: false },
  { label: 'Harga', href: '/pricing', order: 3, isActive: true, isDropdown: false },
  { label: 'Galeri', href: '/gallery', order: 4, isActive: true, isDropdown: false },
  { label: 'Blog', href: '/blog', order: 5, isActive: true, isDropdown: false },
  { label: 'Booking', href: '/booking', order: 6, isActive: true, isDropdown: false },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [navSettings, setNavSettings] = useState<NavigationSettings | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
    };

    const fetchNavSettings = async () => {
      try {
        const settings = await getNavigationSettings();
        if (settings) {
          setNavSettings(settings);
        }
      } catch {
        // Use defaults
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    fetchNavSettings();
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get sorted nav links
  const navLinks = navSettings?.navLinks?.length
    ? [...navSettings.navLinks].sort((a, b) => a.order - b.order).filter(link => link.isActive)
    : DEFAULT_NAV_LINKS;

  const ctaButtonText = navSettings?.ctaButtonText || 'Booking';
  const ctaButtonLink = navSettings?.ctaButtonLink || '/booking';
  const showCtaButton = navSettings?.showCtaButton !== false;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'dark:bg-black/80 bg-white/95 backdrop-blur-xl dark:border-white/10 border-slate-200/50 py-3'
            : 'dark:bg-transparent bg-transparent py-5'
        )}
      >
        <div className="container-fluid">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center shadow-lg dark:shadow-blue-900/50 shadow-blue-200/50 group-hover:shadow-xl transition-all duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className={cn(
                'text-xl font-bold transition-colors',
                isScrolled
                  ? 'dark:text-white text-slate-900'
                  : 'dark:text-white text-slate-900'
              )}>
                Ningclean
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg font-medium transition-all duration-300',
                    isScrolled
                      ? 'dark:text-white/80 dark:hover:text-white dark:hover:bg-white/5 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      : 'dark:text-white/80 dark:hover:text-white text-slate-700 hover:text-slate-900'
                  )}
                >
                  {link.label}
                  {/* Active indicator */}
                  {link.href === '/' && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side - Theme Toggle + Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {showCtaButton && (
                <Link
                  href={ctaButtonLink}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white hover:shadow-lg dark:hover:shadow-blue-900/50 hover:shadow-blue-200/50 transition-all duration-300"
                >
                  {ctaButtonText}
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:shadow-lg hover:shadow-emerald-900/50 transition-all duration-300"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  'p-2 rounded-lg transition-all duration-300',
                  isScrolled
                    ? 'dark:text-white text-slate-700 hover:bg-slate-100 dark:hover:bg-white/10'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <motion.div
                  animate={isMobileMenuOpen ? 'open' : 'closed'}
                  className="w-6 h-5 flex flex-col justify-between"
                >
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: 45, y: 9 }
                    }}
                    className={cn(
                      'w-full h-0.5 rounded-full origin-left',
                      isScrolled ? 'dark:bg-white bg-slate-700' : 'bg-slate-700'
                    )}
                  />
                  <motion.span
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    className={cn(
                      'w-full h-0.5 rounded-full',
                      isScrolled ? 'dark:bg-white bg-slate-700' : 'bg-slate-700'
                    )}
                  />
                  <motion.span
                    variants={{
                      closed: { rotate: 0, y: 0 },
                      open: { rotate: -45, y: -9 }
                    }}
                    className={cn(
                      'w-full h-0.5 rounded-full origin-left',
                      isScrolled ? 'dark:bg-white bg-slate-700' : 'bg-slate-700'
                    )}
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-40 md:hidden"
          >
            <div className="dark:bg-[#0a0a0f]/95 bg-white/95 backdrop-blur-xl pt-24 pb-6 px-4 dark:border-white/10 border-b border-slate-200">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl dark:text-white text-slate-700 font-medium dark:hover:bg-white/5 hover:bg-slate-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                {showCtaButton && (
                  <Link
                    href={ctaButtonLink}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-center"
                  >
                    {ctaButtonText}
                  </Link>
                )}
                {isLoggedIn && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-center"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
