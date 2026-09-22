import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import About from '@/components/sections/About';
import Reviews from '@/components/sections/Reviews';
import Contact from '@/components/sections/Contact';
import { useSiteData } from '@/hooks/useSiteData';
import ErrorState from '@/components/ui/ErrorState';

export default function HomePage() {
  const { error } = useSiteData();

  return (
    <div className="dw-page min-h-screen">
      <Navbar />
      <main>
        <Hero />
        {error === 'not_configured' && (
          <div className="dw-container pb-10">
            <div className="dw-glass p-6 text-center">
              <p className="font-semibold mb-1">Supabase isn't configured yet</p>
              <p className="text-sm opacity-70">
                Copy <code>.env.example</code> to <code>.env</code>, add your Supabase project URL and anon key, then
                restart the dev server to load live content.
              </p>
            </div>
          </div>
        )}
        <Services />
        <Portfolio />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
