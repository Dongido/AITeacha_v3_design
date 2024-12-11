import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FaqsSection from "./components/FaqDesign";
const Faqs = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-24">
        <FaqsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;
