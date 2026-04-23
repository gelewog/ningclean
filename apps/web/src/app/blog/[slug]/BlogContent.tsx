'use client';

import { useEffect, useRef } from 'react';

interface BlogContentProps {
  content?: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const isDark = document.documentElement.classList.contains('dark');
    
    if (!isDark) return;

    // Find all elements with inline styles
    const elementsWithInlineStyles = container.querySelectorAll('[style]');
    
    elementsWithInlineStyles.forEach((el) => {
      const style = (el as HTMLElement).style;
      
      // Override background colors
      if (style.backgroundColor && style.backgroundColor !== 'transparent') {
        (el as HTMLElement).style.setProperty('background-color', 'rgba(30, 41, 59, 0.5)', 'important');
      }
      
      // Override text colors
      if (style.color && (style.color.includes('rgb(0') || style.color.includes('#000') || style.color.includes('black'))) {
        (el as HTMLElement).style.setProperty('color', '#cbd5e1', 'important');
      }
    });

    // Override specific classes
    const allElements = container.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      
      // Check computed style
      const computedBg = window.getComputedStyle(htmlEl).backgroundColor;
      if (computedBg && computedBg !== 'transparent' && computedBg !== 'rgba(0, 0, 0, 0)') {
        // Check if it's a light color
        const rgb = computedBg.match(/\d+/g);
        if (rgb && parseInt(rgb[0]) > 200 && parseInt(rgb[1]) > 200 && parseInt(rgb[2]) > 200) {
          htmlEl.style.setProperty('background-color', 'rgba(30, 41, 59, 0.5)', 'important');
        }
      }
    });
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="article-html-content"
      style={{ color: 'inherit' }}
      dangerouslySetInnerHTML={{ __html: content || '' }}
    />
  );
}
