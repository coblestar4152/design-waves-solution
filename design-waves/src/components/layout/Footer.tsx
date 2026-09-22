import { useSiteData } from '@/hooks/useSiteData';

export default function Footer() {
  const { settings } = useSiteData();
  return (
    <footer className="border-t border-white/10 py-8 mt-10">
      <div className="dw-container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-60 text-center">
        <p>{settings?.footer_text || '© Design Waves Solution. All rights reserved.'}</p>
        <p>{settings?.copyright_text || 'Design Waves Solution'}</p>
      </div>
    </footer>
  );
}
