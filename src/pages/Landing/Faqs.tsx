import Header from "./components/Header";
import Footer from "./components/Footer";
import FaqsSection from "./components/FaqDesign";
const Faqs = () => {
  return (
    <div>
      <Header />
      <div className="mt-24">
        <FaqsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Faqs;
