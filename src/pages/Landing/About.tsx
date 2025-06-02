import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BlogApp from "./components/BlogSlider";
const About = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <div className="mt-32">
        <h2 className="text-4xl text-black text-center font-bold">About Us</h2>
        <h2 className="text-sm text-gray-600 text-center">
          We are your trusted AI solutions partner
        </h2>

        <div className="rounded-t-3xl shadow-md max-w-3xl mx-auto px-8 py-6 mt-8">
          <span className="font-bold">
            {" "}
            Discover the Future of Education with AiTeacha
          </span>
          <br />
          <br />
          Welcome to <span className="font-bold">AiTeacha</span>, your dynamic
          gateway to a revolutionary era of education. At AiTeacha, we are
          committed to reshaping the landscape of teaching and learning through
          cutting-edge artificial intelligence.
          <br />
          <br />
          Our mission is clear: empower educators with tools that transcend
          traditional boundaries. Imagine a world where lesson planning is a
          breeze, assessments are seamlessly generated, and communication with
          students is effective and engaging. AiTeacha transforms this vision
          into reality, offering educators an innovative platform that
          simplifies tasks by up to 95%.
          <br />
          <br /> As pioneers in the educational technology sphere, we understand
          the evolving needs of teachers. AiTeacha is not just a tool; it's a
          partner in your educational journey. Whether you're a seasoned
          educator or just starting, our platform adapts to your unique teaching
          style and enhances your impact in the classroom. <br />
          <br />
          Join us in ushering in a new era of education, where time-consuming
          tasks are streamlined, creativity is unleashed, and students thrive{" "}
          <br />
          <span className="font-bold italics">
            {" "}
            AiTeacha: Shaping the Future of Teaching, One Innovation at a Time.
          </span>
        </div>
      </div>
      <div className="px-0 lg:px-6">
        <BlogApp />
      </div>
      <Footer />
    </div>
  );
};

export default About;
