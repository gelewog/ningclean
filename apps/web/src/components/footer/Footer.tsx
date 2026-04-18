'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getFooterSettings, getSiteSettings } from '@/lib/api';

interface SocialLink {
  name: string;
  href: string;
  icon: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterSettings {
  footerColumns: FooterColumn[];
  showContact: boolean;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactAddress: string;
  showSocials: boolean;
  socialLinks: SocialLink[];
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  showStatusBadge: boolean;
  statusBadgeText: string;
  copyrightText: string;
}

// Fallback social icons
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TikTokIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15v-3.46a4.85 4.85 0 01-2.89-.98z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.5a3 3 0 00-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 00.5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 002.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 002.1-2.1C24 15.6 24 12 24 12s0-3.6-.5-5.5zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
  </svg>
);

const socialIconMap: Record<string, React.FC> = {
  instagram: InstagramIcon,
  whatsapp: WhatsAppIcon,
  tiktok: TikTokIcon,
  youtube: YouTubeIcon,
  instagram_new: InstagramIcon,
  link: InstagramIcon,
};

function SocialIcon({ name }: { name: string }) {
  const Icon = socialIconMap[name.toLowerCase()] || InstagramIcon;
  return <Icon />;
}

// Default fallback data
const DEFAULT_FOOTER = {
  footerColumns: [
    { title: 'Layanan', links: [
      { href: '/services', label: 'Semua Layanan' },
      { href: '/pricing', label: 'Harga' },
      { href: '/services#deep-cleaning', label: 'Deep Cleaning' },
      { href: '/services#regular-cleaning', label: 'Regular Cleaning' },
      { href: '/services#post-construction', label: 'Post Construction' },
      { href: '/services#sofa-cleaning', label: 'Sofa Cleaning' },
      { href: '/services#office-cleaning', label: 'Office Cleaning' },
    ]},
    { title: 'Perusahaan', links: [
      { href: '/about', label: 'Tentang Kami' },
      { href: '/gallery', label: 'Galeri' },
      { href: '/blog', label: 'Blog & Tips' },
      { href: '/contact', label: 'Hubungi Kami' },
      { href: '/faq', label: 'FAQ' },
      { href: '/career', label: 'Karir' },
    ]},
    { title: 'Legal', links: [
      { href: '/privacy', label: 'Kebijakan Privasi' },
      { href: '/terms', label: 'Syarat & Ketentuan' },
      { href: '/refund', label: 'Kebijakan Refund' },
    ]},
    { title: 'Area', links: [
      { href: '/area/surabaya', label: 'Surabaya' },
      { href: '/area/sidoarjo', label: 'Sidoarjo' },
      { href: '/area/gresik', label: 'Gresik' },
    ]},
  ],
  showContact: true,
  contactEmail: 'hello@ningclean.id',
  contactPhone: '+62 812-3456-7890',
  contactWhatsapp: '6281234567890',
  contactAddress: 'Surabaya · Gresik · Sidoarjo',
  showSocials: true,
  socialLinks: [
    { name: 'Instagram', href: 'https://instagram.com/ningclean', icon: 'instagram' },
    { name: 'WhatsApp', href: 'https://wa.me/6281234567890', icon: 'whatsapp' },
    { name: 'TikTok', href: 'https://tiktok.com/@ningclean', icon: 'tiktok' },
    { name: 'YouTube', href: '#', icon: 'youtube' },
  ],
  showNewsletter: true,
  newsletterTitle: 'Dapat tips bersih setiap minggu',
  newsletterSubtitle: 'Promo eksklusif, panduan perawatan rumah, dan info layanan baru langsung ke inbox kamu.',
  showStatusBadge: true,
  statusBadgeText: 'Semua layanan aktif',
  copyrightText: 'All rights reserved.',
};

// ─── Newsletter ─────────────────────────────────────────────────────────────

function NewsletterBand({ settings }: { settings: FooterSettings }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    setTimeout(() => setStatus('done'), 700);
  };

  const title = settings.newsletterTitle || DEFAULT_FOOTER.newsletterTitle;
  const subtitle = settings.newsletterSubtitle || DEFAULT_FOOTER.newsletterSubtitle;

  return (
    <div className="dark:border-slate-800 border-slate-200 py-14">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-serif text-[clamp(26px,3.5vw,40px)] font-normal leading-[1.1] dark:text-white text-slate-900">
              {title.split(' ').slice(0, 2).join(' ')}<br />
              <em className="italic dark:text-emerald-400 text-emerald-600">{title.split(' ').slice(2).join(' ')}</em>
            </h3>
            <p className="text-[14px] dark:text-white/40 text-slate-500 mt-3 leading-relaxed max-w-[340px]">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl
                             dark:bg-emerald-500/[0.08] dark:border-emerald-500/20
                             bg-emerald-50 border-emerald-200
                             dark:text-emerald-400 text-emerald-600 font-semibold text-[14px]"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Berhasil! Cek inbox kamu.
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex gap-2.5"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@kamu.com"
                    className="flex-1 px-4 py-3 rounded-xl text-[13px]
                               dark:text-white dark:bg-white/[0.05] dark:border-white/10
                               dark:placeholder-white/28
                               text-slate-700 bg-slate-100 border border-slate-200
                               placeholder-slate-400
                               focus:outline-none focus:dark:border-emerald-500/40 focus:dark:bg-emerald-500/[0.04]
                               focus:border-emerald-500 focus:bg-white
                               transition-colors duration-200"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-5 py-3 rounded-xl text-[13px] font-bold
                               dark:text-emerald-400 dark:bg-emerald-500/[0.12] dark:border-emerald-500/25
                               dark:hover:bg-emerald-500/20 dark:hover:border-emerald-500/40
                               text-emerald-600 bg-emerald-50 border border-emerald-200
                               hover:bg-emerald-100 hover:border-emerald-300
                               disabled:opacity-60
                               transition-colors duration-200 whitespace-nowrap"
                  >
                    {status === 'loading' ? '...' : 'Daftar Sekarang'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="flex items-center gap-1.5 text-[11px] dark:text-white/25 text-slate-400">
              <svg width="11" height="11" viewBox="0 0 14 16" fill="none">
                <rect x="2" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M4.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              Email kamu aman. Tidak ada spam, berhenti kapan saja.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Link column ─────────────────────────────────────────────────────────────

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h5 className="text-[10px] font-bold tracking-[.12em] uppercase dark:text-white/30 text-slate-400 mb-4">
        {title}
      </h5>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[13px] dark:text-white/48 text-slate-500 hover:dark:text-white hover:text-slate-700 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Contact items ───────────────────────────────────────────────────────────

function ContactItems({ settings, siteSettings }: { settings: FooterSettings; siteSettings?: any }) {
  const email = siteSettings?.email || settings.contactEmail || DEFAULT_FOOTER.contactEmail;
  const phone = siteSettings?.phone || settings.contactPhone || DEFAULT_FOOTER.contactPhone;
  const whatsapp = siteSettings?.whatsapp || settings.contactWhatsapp || DEFAULT_FOOTER.contactWhatsapp;
  const address = siteSettings?.address || settings.contactAddress || DEFAULT_FOOTER.contactAddress;

  const items = [
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 5l7 5 7-5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ),
      label: email,
      href: `mailto:${email}`,
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 3.5a1 1 0 011-1h.5l1.5 3-.75.75a6.5 6.5 0 003.5 3.5l.75-.75 3 1.5v.5a1 1 0 01-1 1C6.268 12.5 3.5 9.732 3.5 6.5c0-.553.197-1.5.5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ),
      label: phone,
      href: `https://wa.me/${whatsapp}`,
    },
    {
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ),
      label: address,
      href: undefined,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] w-fit
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/45
                       bg-white border border-slate-200 text-slate-500
                       hover:dark:bg-white/[0.07] hover:dark:text-white/75
                       hover:bg-slate-50 hover:text-slate-700
                       transition-all duration-200 text-[12px]"
          >
            <span className="dark:text-white/50 text-slate-400">{item.icon}</span>
            {item.label}
          </a>
        ) : (
          <div
            key={item.label}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] w-fit
                       dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-white/45
                       bg-white border border-slate-200 text-slate-500
                       transition-all duration-200 text-[12px]"
          >
            <span className="dark:text-white/50 text-slate-400">{item.icon}</span>
            {item.label}
          </div>
        )
      )}
    </div>
  );
}

// ─── Social links ────────────────────────────────────────────────────────────

function SocialLinks({ socialLinks }: { socialLinks: SocialLink[] }) {
  return (
    <div className="flex gap-2 mb-7">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
          className="w-9 h-9 rounded-[10px] flex items-center justify-center
                     dark:bg-white/[0.04] dark:border-white/[0.08] dark:text-white/45
                     bg-slate-100 border border-slate-200 text-slate-500
                     hover:dark:bg-emerald-500/10 hover:dark:border-emerald-500/25 hover:dark:text-emerald-400
                     hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600
                     transition-all duration-200"
        >
          <SocialIcon name={social.icon || social.name} />
        </a>
      ))}
    </div>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const data = await getFooterSettings();
        if (data) {
          setSettings(data);
        }
      } catch {
        // Use defaults
      }
    };

    const fetchSiteSettings = async () => {
      try {
        const data = await getSiteSettings();
        if (data) {
          setSiteSettings(data);
        }
      } catch {
        // Use defaults
      }
    };

    fetchFooterSettings();
    fetchSiteSettings();
  }, []);

  // Merge with defaults
  const footer: FooterSettings = settings ? {
    ...DEFAULT_FOOTER,
    ...settings,
    footerColumns: settings.footerColumns?.length ? settings.footerColumns : DEFAULT_FOOTER.footerColumns,
    socialLinks: settings.socialLinks?.length ? settings.socialLinks : DEFAULT_FOOTER.socialLinks,
  } : DEFAULT_FOOTER;

  const showContact = footer.showContact !== false;
  const showSocials = footer.showSocials !== false;
  const showNewsletter = footer.showNewsletter !== false;
  const showStatusBadge = footer.showStatusBadge !== false;

  // Use site settings contact info if available
  const contactEmail = siteSettings?.email || footer.contactEmail;
  const contactPhone = siteSettings?.phone || footer.contactPhone;
  const contactWhatsapp = siteSettings?.whatsapp || footer.contactWhatsapp;
  const contactAddress = siteSettings?.address || footer.contactAddress;
  const companyName = siteSettings?.companyName || 'Ningclean';

  return (
    <footer className="relative dark:bg-[#09090f] bg-slate-50 text-white dark:text-white overflow-hidden">
      {/* Ambient orbs - dark mode only */}
      <div className="pointer-events-none select-none dark:block hidden">
        <div className="absolute -top-28 -left-20 w-[440px] h-[440px] rounded-full bg-emerald-500/[0.07] blur-[110px]" />
        <div className="absolute bottom-0 -right-16 w-[360px] h-[360px] rounded-full bg-blue-700/[0.07] blur-[110px]" />
      </div>

      {/* Newsletter band */}
      {showNewsletter && <NewsletterBand settings={footer} />}

      {/* Main grid */}
      <div className="relative container mx-auto px-6 max-w-5xl pt-16 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 pb-14 dark:border-white/[0.06] border-slate-200">

          {/* Brand column */}
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] dark:bg-emerald-500/[0.12] dark:border-emerald-500/20 bg-emerald-100 border-emerald-200
                              flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    className="dark:stroke-emerald-400 stroke-emerald-600"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-serif text-[22px] font-normal tracking-[-0.3px] dark:text-white text-slate-900">{companyName}</span>
            </Link>

            <p className="text-[13px] dark:text-white/38 text-slate-500 leading-[1.7] max-w-[240px] mb-6">
              Layanan cleaning profesional di Surabaya, Gresik & Sidoarjo. Hasil maksimal, harga terjangkau, garansi 100%.
            </p>

            {/* Socials */}
            {showSocials && <SocialLinks socialLinks={footer.socialLinks} />}

            {/* Contact */}
            {showContact && <ContactItems settings={footer} siteSettings={siteSettings} />}
          </div>

          {/* Link columns */}
          {footer.footerColumns.map((column) => (
            <LinkColumn key={column.title} title={column.title} links={column.links} />
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-5">
          <div className="flex items-center flex-wrap gap-4">
            <span className="text-[12px] dark:text-white/28 text-slate-400">
              © {new Date().getFullYear()} {companyName}. {footer.copyrightText || 'All rights reserved.'}
            </span>
            <span className="w-px h-3.5 dark:bg-white/10 bg-slate-200 hidden sm:block" />
            {[['Privasi','/privacy'], ['Syarat','/terms'], ['Sitemap','/sitemap']].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[12px] dark:text-white/28 text-slate-400 hover:dark:text-white/65 hover:text-slate-600 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Live status badge */}
          {showStatusBadge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            dark:bg-emerald-500/[0.08] dark:border-emerald-500/[0.15] dark:text-emerald-400/80
                            bg-emerald-50 border border-emerald-200 text-emerald-600 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full dark:bg-emerald-400 bg-emerald-500 animate-pulse" />
              {footer.statusBadgeText || 'Semua layanan aktif'}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
