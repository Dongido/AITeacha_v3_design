import Header from "./components/Header";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
const Blog = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Header />
      </section>
      <BlogApp />
      <Footer />
    </div>
  );
};

export default Blog;
