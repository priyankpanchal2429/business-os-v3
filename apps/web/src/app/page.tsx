import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Contact } from '../components/landing/Contact';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
    return (
        <div className="bg-white">
            <Navbar />
            <Hero />
            <Contact />
            <Footer />
        </div>
    );
}
