import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
const Blog = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <BlogApp />
      <Footer />
    </div>
  );
};

export default Blog;
