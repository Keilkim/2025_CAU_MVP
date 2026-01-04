import React from 'react';
import Link from 'next/link';
import { footerLinks } from '@/data/navigation';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom py-12">
        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {Object.values(footerLinks).map((group) => (
            <div key={group.title}>
              <h3 className="font-semibold text-foreground mb-4">{group.titleKo}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-foreground transition-colors text-sm"
                    >
                      {link.labelKo}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ML</span>
              </div>
              <span className="text-muted text-sm">
                © 2024 ML Server Platform. All rights reserved.
              </span>
            </div>

            {/* Company Info */}
            <div className="text-muted text-xs text-center md:text-right">
              <p>서울특별시 강남구 테헤란로 123</p>
              <p>사업자등록번호: 123-45-67890</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
