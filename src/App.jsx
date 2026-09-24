import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import SiteMap from './pages/SiteMap';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import AdminFinances from './pages/admin/AdminFinances';
import AdminSettings from './pages/admin/AdminSettings';
import AdminClients from './pages/admin/AdminClients';
import AdminClientDetail from './pages/admin/AdminClientDetail';
import AdminProjects from './pages/admin/AdminProjects';
import AdminQuotations from './pages/admin/AdminQuotations';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminRenewals from './pages/admin/AdminRenewals';
import AdminEmployees from './pages/admin/AdminEmployees';
import AdminTimesheets from './pages/admin/AdminTimesheets';
import AdminTickets from './pages/admin/AdminTickets';
import AdminArticles from './pages/admin/AdminArticles';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import AdminDocumentPrint from './pages/admin/AdminDocumentPrint';
import RequireArea from './pages/admin/components/RequireArea';
import './App.css';

function SiteLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsArticle />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/sitemap" element={<SiteMap />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="submissions" element={<RequireArea area="leads"><AdminSubmissions /></RequireArea>} />
          <Route path="quotations" element={<RequireArea area="quotations"><AdminQuotations /></RequireArea>} />
          <Route path="clients" element={<RequireArea area="clients"><AdminClients /></RequireArea>} />
          <Route path="clients/:id" element={<RequireArea area="clients"><AdminClientDetail /></RequireArea>} />
          <Route path="projects" element={<RequireArea area="projects"><AdminProjects /></RequireArea>} />
          <Route path="timesheets" element={<RequireArea area="timesheets"><AdminTimesheets /></RequireArea>} />
          <Route path="tickets" element={<RequireArea area="tickets"><AdminTickets /></RequireArea>} />
          <Route path="invoices" element={<RequireArea area="invoices"><AdminInvoices /></RequireArea>} />
          <Route path="finances" element={<RequireArea area="finances"><AdminFinances /></RequireArea>} />
          <Route path="renewals" element={<RequireArea area="renewals"><AdminRenewals /></RequireArea>} />
          <Route path="team" element={<RequireArea area="employees"><AdminEmployees /></RequireArea>} />
          <Route path="news" element={<RequireArea area="content"><AdminArticles /></RequireArea>} />
          <Route path="users" element={<RequireArea area="users"><AdminUsers /></RequireArea>} />
          <Route path="audit-log" element={<RequireArea area="audit"><AdminAuditLog /></RequireArea>} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route
          path="/admin-print/:kind/:id"
          element={
            <ProtectedRoute>
              <AdminDocumentPrint />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <SiteLayout />
    </Router>
  );
}

export default App;
