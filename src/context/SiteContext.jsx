import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../admin/services/api';
import { companyInfo as defaultCompanyInfo } from '../data/companyInfo';
import { servicesData as defaultServices } from '../data/servicesData';
import { faqData as defaultFaqs } from '../data/faqData';
import { advantagesData as defaultAdvantages } from '../data/advantagesData';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(defaultCompanyInfo);
  const [services, setServices] = useState(defaultServices);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [projects, setProjects] = useState([]);
  const [advantages, setAdvantages] = useState(defaultAdvantages);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPublicData = async () => {
    try {
      const [siteRes, servicesRes, faqsRes, projectsRes] = await Promise.allSettled([
        api.getPublicSite(),
        api.getPublicServices(),
        api.getPublicFaqs(),
        api.getPublicProjects()
      ]);

      if (siteRes.status === 'fulfilled' && siteRes.value && siteRes.value.success) {
        if (siteRes.value.settings && Object.keys(siteRes.value.settings).length > 0) {
          setSiteSettings(prev => ({ ...prev, ...siteRes.value.settings }));
        }
        if (siteRes.value.content) {
          setContent(siteRes.value.content);
        }
      }

      if (servicesRes.status === 'fulfilled' && servicesRes.value && servicesRes.value.success) {
        if (servicesRes.value.services && servicesRes.value.services.length > 0) {
          setServices(servicesRes.value.services);
        }
      }

      if (faqsRes.status === 'fulfilled' && faqsRes.value && faqsRes.value.success) {
        if (faqsRes.value.faqs && faqsRes.value.faqs.length > 0) {
          setFaqs(faqsRes.value.faqs);
        }
      }

      if (projectsRes.status === 'fulfilled' && projectsRes.value && projectsRes.value.success) {
        if (projectsRes.value.projects) {
          setProjects(projectsRes.value.projects);
        }
      }
    } catch (err) {
      console.warn('[SiteContext Warning] Fetching public API failed, using static fallback content.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  return (
    <SiteContext.Provider value={{ siteSettings, services, faqs, projects, advantages, content, loading, refetch: fetchPublicData }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteContext);
}
