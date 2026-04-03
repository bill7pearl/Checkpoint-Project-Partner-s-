import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="main-content" style={{ minHeight: 'calc(100vh - var(--nav-height))', paddingTop: 'var(--nav-height)' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
