import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />
      <main className="flex-grow p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[var(--primary)]">About Us</h1>
        <p className="text-lg mb-4 text-[var(--foreground)]">We provide a comprehensive, modern student management platform built with Next.js, Tailwind, and MongoDB.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 bg-gradient-to-r from-[var(--accent)] to-[var(--secondary)] rounded-xl text-white shadow-md">
            <h3 className="text-2xl font-bold mb-2">Our Mission</h3>
            <p>Empower education with secure tools.</p>
          </div>
          <div className="p-6 bg-gradient-to-r from-[var(--secondary)] to-[var(--accent)] rounded-xl text-white shadow-md">
            <h3 className="text-2xl font-bold mb-2">Features</h3>
            <p>RBAC, dashboards, responsive design.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}