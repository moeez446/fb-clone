import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function FeedPage() {
  return (
    <div className="app__feed-wrapper">
      <Feed />
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isFeed = location.pathname === '/';

  return (
    <div className="app">
      <header>
        <Navbar />
      </header>

      <div className="app__container">

        {isFeed && (
          <aside className="app__sidebar">
            <Sidebar />
          </aside>
        )}

        <main className="app__main">
          <Routes>
            {/* ── Main Pages ── */}
            <Route path="/"            element={<FeedPage />}    />
            <Route path="/friends"     element={<Friends />}     />
            <Route path="/watch"       element={<Watch />}       />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/saved"       element={<Saved />}       />
            <Route path="/events"      element={<Events />}      />

            {/* ── Coming Soon Pages ── */}
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

            {/* ── 404 Fallback ── */}
            <Route path="*"            element={<ComingSoon />}  />
          </Routes>
        </main>

        {isFeed && (
          <aside className="app__rightbar">
            <RightBar />
          </aside>
        )}

      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;