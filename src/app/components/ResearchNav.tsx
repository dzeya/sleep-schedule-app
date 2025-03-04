"use client";

import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  title: string;
  level: number;
}

export default function ResearchNav() {
  const [activeSection, setActiveSection] = useState<string>('');
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    // Find all section headers in the article
    const headings = Array.from(document.querySelectorAll('h2, h3'))
      .filter(el => el.id || el.textContent)
      .map(el => {
        const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
        if (!el.id) el.id = id;
        
        return {
          id,
          title: el.textContent || '',
          level: el.tagName === 'H2' ? 2 : 3
        };
      });
    
    setNavItems(headings);

    // Set up intersection observer to determine active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="hidden lg:block sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4">
      <h3 className="font-medium text-gray-900 mb-4">Table of Contents</h3>
      <nav className="text-sm">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li 
              key={item.id} 
              className={`${item.level === 3 ? 'pl-4' : 'font-medium'}`}
            >
              <a
                href={`#${item.id}`}
                className={`block py-1 hover:text-blue-600 transition-colors ${
                  activeSection === item.id
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 