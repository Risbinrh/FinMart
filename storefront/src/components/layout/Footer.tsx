'use client';

import Link from 'next/link';
import { Fish, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
<<<<<<< HEAD
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';
=======

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Sea Fish', href: '/products?category=sea-fish-premium' },
    { name: 'Prawns', href: '/products?category=prawns' },
    { name: 'Crabs', href: '/products?category=crabs' },
    { name: 'River Fish', href: '/products?category=river-fish' },
    { name: 'Recipes', href: '/recipes' },
  ],
  account: [
    { name: 'My Account', href: '/profile' },
    { name: 'My Orders', href: '/orders' },
    { name: 'My Addresses', href: '/profile/addresses' },
    { name: 'Cart', href: '/cart' },
  ],
  info: [
    { name: 'Delivery Zones', href: '/zone-demo' },
    { name: 'Track Order', href: '/orders' },
  ],
};
>>>>>>> 5494701970030cda6266ceac303270eca30562a1

export default function Footer() {
  const { language } = useLanguage();

  const footerLinks = {
    shop: [
      { name: t('allProducts', language), href: '/products' },
      { name: t('seaFish', language), href: '/products?category=sea-fish' },
      { name: t('riverFish', language), href: '/products?category=river-fish' },
      { name: t('prawnsCrabs', language), href: '/products?category=prawns' },
      { name: t('recipes', language), href: '/recipes' },
    ],
    support: [
      { name: t('contactUs', language), href: '/contact' },
      { name: t('faqs', language), href: '/faqs' },
      { name: t('deliveryInfo', language), href: '/delivery' },
      { name: t('trackOrder', language), href: '/track-order' },
      { name: t('returns', language), href: '/returns' },
    ],
    company: [
      { name: t('aboutUs', language), href: '/about' },
      { name: t('ourStory', language), href: '/our-story' },
      { name: t('careers', language), href: '/careers' },
      { name: t('blog', language), href: '/blog' },
    ],
    legal: [
      { name: t('privacyPolicy', language), href: '/privacy' },
      { name: t('termsOfService', language), href: '/terms' },
      { name: t('refundPolicy', language), href: '/refund' },
    ],
  };
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Fish className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">FreshCatch</h2>
                <p className="text-xs text-slate-400">{t('freshFishDelivery', language)}</p>
              </div>
            </Link>
            <p className="text-sm mb-4 max-w-sm">
              {t('footerTagline', language)}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@freshcatch.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{t('locationCity', language)}</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('shop', language)}</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
<<<<<<< HEAD
            <h3 className="text-white font-semibold mb-4">{t('support', language)}</h3>
=======
            <h3 className="text-white font-semibold mb-4">My Account</h3>
>>>>>>> 5494701970030cda6266ceac303270eca30562a1
            <ul className="space-y-2 text-sm">
              {footerLinks.account.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
<<<<<<< HEAD
            <h3 className="text-white font-semibold mb-4">{t('company', language)}</h3>
=======
            <h3 className="text-white font-semibold mb-4">Information</h3>
>>>>>>> 5494701970030cda6266ceac303270eca30562a1
            <ul className="space-y-2 text-sm">
              {footerLinks.info.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
<<<<<<< HEAD
            <p>&copy; 2024 FreshCatch. {t('allRightsReserved', language)}</p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-primary transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
=======
            <p>&copy; 2025 FreshCatch. All rights reserved.</p>
            <p className="text-slate-500">Made with ❤️ in Chennai, Tamil Nadu</p>
>>>>>>> 5494701970030cda6266ceac303270eca30562a1
          </div>
        </div>
      </div>
    </footer>
  );
}
