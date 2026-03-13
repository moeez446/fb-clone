import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './layout/Navbar';
import Sidebar from './layout/Sidebar';
import RightBar from './layout/Rightbar';
import Feed from './components/Feed';
import Friends from './pages/Friends';
import Watch from './pages/Watch';
import Marketplace from './pages/Marketplace';
import Saved from './pages/Saved';
import Events from './pages/Events';
import ComingSoon from './pages/CommingSoon';
import Login from './pages/Login';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Toast from './components/Toast';

function FeedPage() {
  return (
    <div className="app__feed-wrapper">
      <Feed />
    </div>
  );
}

// Pages that have their OWN left panel/sidebar — main sidebar hides on these
const PAGES_WITH_OWN_SIDEBAR = [
  '/login',
  '/register',
  '/forgot',
];

function Layout() {
  const location = useLocation();
  const { toasts, removeToast } = useCart();

  const isFeed      = location.pathname === '/';
  const hideNavbar  = ['/login', '/register', '/forgot'].includes(location.pathname);
  const hideSidebar = PAGES_WITH_OWN_SIDEBAR.some(p => location.pathname.startsWith(p));

  return (
    <div className="app">
      {!hideNavbar && (
        <header>
          <Navbar />
        </header>
      )}

      <div className="app__container">

        {!hideSidebar && (
          <aside className="app__sidebar">
            <Sidebar />
          </aside>
        )}

        <main className="app__main">
          <Routes>
            <Route path="/"            element={<FeedPage />}    />
            <Route path="/friends"     element={<Friends />}     />
            <Route path="/watch"       element={<Watch />}       />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/saved"       element={<Saved />}       />
            <Route path="/events"      element={<Events />}      />
            <Route path="/login"       element={<Login />}       />
            <Route path="/products"    element={<Products />}    />
            <Route path="/checkout"    element={<Checkout />}    />
            <Route path="/gaming"      element={<ComingSoon />}  />
            <Route path="/memories"    element={<ComingSoon />}  />
            <Route path="/groups"      element={<ComingSoon />}  />
            <Route path="/pages"       element={<ComingSoon />}  />
            <Route path="/videos"      element={<ComingSoon />}  />
            <Route path="/feeds"       element={<ComingSoon />}  />
            <Route path="/fundraisers" element={<ComingSoon />}  />
            <Route path="/community"   element={<ComingSoon />}  />
            <Route path="/jobs"        element={<ComingSoon />}  />
            <Route path="/birthdays"   element={<ComingSoon />}  />
            <Route path="/explore"     element={<ComingSoon />}  />
            <Route path="*"            element={<ComingSoon />}  />
          </Routes>
        </main>

        {isFeed && (
          <aside className="app__rightbar">
            <RightBar />
          </aside>
        )}

      </div>

      {/* ── Global Toast ── */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;