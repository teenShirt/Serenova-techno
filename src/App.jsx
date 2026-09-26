import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import './styles/base.css';
import './styles/animations.css';
import './styles/components.css';

import { AuthProvider } from './admin/context/AuthContext';
import { SiteProvider } from './context/SiteContext';

import Header from './components/Header';
import Hero from './components/Hero';
import TrustCapabilities from './components/TrustCapabilities';
import Services from './components/Services';
import ServiceDetail from './components/ServiceDetail';
import SolutionsSection from './components/SolutionsSection';
import FeaturedProjects from './components/FeaturedProjects';
import ProjectDetail from './components/ProjectDetail';
import HowWeWork from './components/HowWeWork';
import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';
import ContactSection from './components/ContactSection';
import ConfirmationPage from './components/ConfirmationPage';
import Footer from './components/Footer';

import ConsultationModal from './components/ConsultationModal';
import PolicyModal from './components/PolicyModal';
import Toast from './components/Toast';

import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute';
import LoginPage from './admin/pages/LoginPage';
import DashboardOverview from './admin/pages/DashboardOverview';
import LeadsManager from './admin/pages/LeadsManager';
import ContentManager from './admin/pages/ContentManager';
import ServicesManager from './admin/pages/ServicesManager';
import ProjectsManager from './admin/pages/ProjectsManager';
import FAQManager from './admin/pages/FAQManager';
import MediaLibrary from './admin/pages/MediaLibrary';
import SettingsManager from './admin/pages/SettingsManager';
import ChangePassword from './admin/pages/ChangePassword';

function HomePage({ onOpenConsultation, showToast }) {
  return (
    <main>
      <Hero onOpenConsultation={onOpenConsultation} />
      <TrustCapabilities />
      <Services onOpenConsultation={onOpenConsultation} />
      <SolutionsSection onOpenConsultation={onOpenConsultation} />
      <FeaturedProjects onOpenConsultation={onOpenConsultation} />
      <HowWeWork />
      <AboutUs onOpenConsultation={onOpenConsultation} />
      <FAQ />
      <ContactSection showToast={showToast} />
    </main>
  );
}

function PublicWebsite() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationService, setConsultationService] = useState('');
  const [activePolicy, setActivePolicy] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleOpenConsultation = (serviceName = '') => {
    setConsultationService(typeof serviceName === 'string' ? serviceName : '');
    setConsultationOpen(true);
  };

  return (
    <div className="app-root">
      <Header onOpenConsultation={() => handleOpenConsultation()} />

      <Routes>
        <Route path="/" element={<HomePage onOpenConsultation={handleOpenConsultation} showToast={showToast} />} />
        <Route path="/services" element={<div style={{ paddingTop: '80px' }}><Services onOpenConsultation={handleOpenConsultation} /></div>} />
        <Route path="/services/:slug" element={<ServiceDetail onOpenConsultation={handleOpenConsultation} />} />
        <Route path="/solutions" element={<div style={{ paddingTop: '80px' }}><SolutionsSection onOpenConsultation={handleOpenConsultation} /></div>} />
        <Route path="/projects" element={<div style={{ paddingTop: '80px' }}><FeaturedProjects onOpenConsultation={handleOpenConsultation} /></div>} />
        <Route path="/projects/:slug" element={<ProjectDetail onOpenConsultation={handleOpenConsultation} />} />
        <Route path="/about" element={<div style={{ paddingTop: '80px' }}><AboutUs onOpenConsultation={handleOpenConsultation} /></div>} />
        <Route path="/how-we-work" element={<div style={{ paddingTop: '80px' }}><HowWeWork /></div>} />
        <Route path="/faq" element={<div style={{ paddingTop: '80px' }}><FAQ /></div>} />
        <Route path="/contact" element={<div style={{ paddingTop: '80px' }}><ContactSection showToast={showToast} initialService={consultationService} /></div>} />
        <Route path="/confirmation/:refNumber" element={<ConfirmationPage />} />
      </Routes>

      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      {/* Global Modals */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        showToast={showToast}
        initialService={consultationService}
      />

      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin CMS Dashboard */}
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<DashboardOverview />} />
              <Route path="leads" element={<LeadsManager />} />
              <Route path="messages" element={<LeadsManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="faqs" element={<FAQManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<SettingsManager />} />
              <Route path="password" element={<ChangePassword />} />
            </Route>

            {/* Public Website */}
            <Route path="/*" element={<PublicWebsite />} />
          </Routes>
        </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}
