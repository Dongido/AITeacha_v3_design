import LayoutTextFlipDemo from "../../../pages/Landing/components/LayoutTextFlipDemo";

const Hero = () => {
  return (
      <section className="lg:min-h-screen h-[90vh] bg-white relative flex items-center justify-center px-6 md:px-16">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center py-12">
          <LayoutTextFlipDemo />
        </div>
      </section>
  );
};

export default Hero;