'use client';

import { useEffect } from 'react';

export default function BisCleanup() {
  useEffect(() => {
    const removeBis = (node: Node) => {
      if (node.nodeType === 1) {
        const el = node as Element;
        if (el.hasAttribute('bis_skin_checked')) {
          el.removeAttribute('bis_skin_checked');
        }
        el.querySelectorAll('[bis_skin_checked]').forEach((child) =>
          child.removeAttribute('bis_skin_checked'),
        );
      }
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'bis_skin_checked'
        ) {
          (mutation.target as Element).removeAttribute('bis_skin_checked');
        }
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(removeBis);
        }
      }
    });

    removeBis(document.documentElement);
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked'],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
