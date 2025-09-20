'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavItem = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
  <Link
    href={href}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      active ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-gray-900'
    }`}
  >
    {label}
  </Link>
);

export default function NavBar() {
  const pathname = usePathname() || '/';
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;

      // Always show near top
      if (y < 48) {
        setHidden(false);
      } else if (delta > 12) {
        // scrolling down -> hide
        setHidden(true);
      } else if (delta < -12) {
        // scrolling up -> show
        setHidden(false);
      }

      lastY.current = y;
    };

    // ensure initial value
    lastY.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      role="banner"
      aria-hidden={hidden ? 'true' : 'false'}
      className={`fixed top-0 left-0 right-0 z-50 transform-gpu transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } bg-white shadow-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm w-9 h-9">
              <span className="text-white font-semibold text-sm">A</span>
            </div>

            <div className="transition-opacity duration-200">
              <div className="text-sm font-semibold text-gray-800">Marketinc</div>
            </div>
          </div>

          {/* Right side: tabs aligned to the right */}
          <div className="flex items-center gap-3">
            <nav aria-label="Main" className="hidden sm:flex items-center gap-2 mr-2">
              <NavItem href="/campaign-calendar" label="Calendar" active={pathname.startsWith('/campaign-calendar')} />
              <NavItem href="/analytics" label="Analytics" active={pathname.startsWith('/analytics')} />
              <NavItem href="/ideas-tab" label="Ideas" active={pathname.startsWith('/ideas-tab')} />
              <NavItem href="/settings" label="Settings" active={pathname.startsWith('/settings')} />
            </nav>

            <div className="w-px h-6 bg-transparent" />
          </div>
        </div>
      </div>
    </header>
  );
}
