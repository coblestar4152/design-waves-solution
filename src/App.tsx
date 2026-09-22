import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import LoginPage from '@/admin/pages/LoginPage';
import DashboardPage from '@/admin/pages/DashboardPage';
import WebsiteSettingsPage from '@/admin/pages/WebsiteSettingsPage';
import HomeContentPage from '@/admin/pages/HomeContentPage';
import ServicesPage from '@/admin/pages/ServicesPage';
import ServiceCategoriesPage from '@/admin/pages/ServiceCategoriesPage';
import PortfolioPage from '@/admin/pages/PortfolioPage';
import AboutPage from '@/admin/pages/AboutPage';
import ReviewsPage from '@/admin/pages/ReviewsPage';
import ContactPage from '@/admin/pages/ContactPage';
import ThemePage from '@/admin/pages/ThemePage';
import AnimationsPage from '@/admin/pages/AnimationsPage';
import BrandingPage from '@/admin/pages/BrandingPage';
import SeoPage from '@/admin/pages/SeoPage';
import AdminAccountPage from '@/admin/pages/AdminAccountPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<WebsiteSettingsPage />} />
        <Route path="home" element={<HomeContentPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="service-categories" element={<ServiceCategoriesPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="theme" element={<ThemePage />} />
        <Route path="animations" element={<AnimationsPage />} />
        <Route path="branding" element={<BrandingPage />} />
        <Route path="seo" element={<SeoPage />} />
        <Route path="account" element={<AdminAccountPage />} />
      </Route>
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
