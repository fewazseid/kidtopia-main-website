import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface IframePreviewProps {
  children: React.ReactNode;
  className?: string;
}

export const IframePreview: React.FC<IframePreviewProps> = ({ children, className }) => {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!iframeRef) return;
    const doc = iframeRef.contentDocument || iframeRef.contentWindow?.document;
    if (!doc) return;

    // Set base styling inside the iframe
    const baseStyle = doc.createElement('style');
    baseStyle.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
        background-color: transparent;
        font-family: system-ui, -apple-system, sans-serif;
        overflow-x: hidden;
      }
      /* Styled scrollbars */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: #e7e5e4;
        border-radius: 3px;
      }
    `;
    doc.head.appendChild(baseStyle);

    // Copy existing stylesheets/link tags
    const parentStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    parentStyles.forEach((styleTag) => {
      doc.head.appendChild(styleTag.cloneNode(true));
    });

    // Set the body element as mount node
    setMountNode(doc.body);

    // Watch for dynamically added styles (vital for dev mode HMR / style injection)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'STYLE' || (node.nodeName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet')) {
            doc.head.appendChild(node.cloneNode(true));
          }
        });
      });
    });

    observer.observe(document.head, { childList: true });
    return () => observer.disconnect();
  }, [iframeRef]);

  return (
    <iframe
      ref={setIframeRef}
      className={className}
      title="Device Preview Viewport"
      style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
