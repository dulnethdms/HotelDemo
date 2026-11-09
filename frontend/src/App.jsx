import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { Loader } from './components/Ui';
import Home from './pages/Home';
import About from './pages/About';
import Accommodation from './pages/Accommodation';
import Gallery from './pages/Gallery';
import Promotions from './pages/Promotions';
import Location from './pages/Location';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin is code-split so public visitors never download it
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const PackagesAdmin = lazy(() => import('./admin/PackagesAdmin'));
const PromotionsAdmin = lazy(() => import('./admin/PromotionsAdmin'));
const GalleryAdmin = lazy(() => import('./admin/GalleryAdmin'));
const ContentAdmin = lazy(() => import('./admin/ContentAdmin'));
const MessagesAdmin = lazy(() => import('./admin/MessagesAdmin'));
const AccountAdmin = lazy(() => import('./admin/AccountAdmin'));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accommodation" element={<Accommodation />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="packages" element={<PackagesAdmin />} />
          <Route path="promotions" element={<PromotionsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="content" element={<ContentAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="account" element={<AccountAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
