import React, { useState, useEffect } from 'react';

function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isWhatsApp = /WhatsApp/i.test(ua);
  const isInstagram = /Instagram/i.test(ua);
  const isFacebook = /FBAN|FBAV|FB_IAB/i.test(ua);
  const isAndroidWebView = /wv/.test(ua) && /Android/i.test(ua);
  return isWhatsApp || isInstagram || isFacebook || isAndroidWebView;
}

export const OpenInBrowserBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(isInAppBrowser());
  }, []);

  if (!show) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleOpen = () => {
    const intentUrl = `intent://${currentUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 1500);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderBottom: '2px solid rgba(255,255,255,0.15)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: '#fff',
          fontSize: '13px',
          fontWeight: '700',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '0.02em',
        }}>
          افتح الرابط بالمتصفح لتشوف كل المنتجات
        </p>
        <p style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '11px',
          margin: '3px 0 0',
          lineHeight: 1.3,
        }}>
          بعض المتصفحات الداخلية بتمنع تحميل المنتجات
        </p>
      </div>
      <button
        onClick={handleOpen}
        style={{
          background: '#fff',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '9px 14px',
          fontSize: '12px',
          fontWeight: '800',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          letterSpacing: '0.03em',
          flexShrink: 0,
        }}
      >
        افتح بالمتصفح
      </button>
    </div>
  );
};
