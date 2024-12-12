import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const AITeachaMission = () => {
  return (
    <>
      <Navbar />

      <section className="bg-gray-100 text-gray-800 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-primary text-center mb-6">
            AI Teacha Mission
          </h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="text-lg font-bold"> At AI Teacha</span>, our
            mission is to revolutionize education by empowering educators with
            innovative AI-powered tools that simplify teaching, enhance
            personalized learning, and make quality educational resources
            accessible, fostering transformative, efficient, and impactful
            learning experiences across Africa and beyond.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            At AI Teacha, we recognize the unique challenges facing educators in
            Nigeria and across Africa. Teaching is not just a profession; it is
            a commitment to nurturing young minds and shaping the future.
            However, the burdens of administrative tasks, lesson planning, and
            adapting materials for diverse classrooms often leave teachers
            overwhelmed, reducing their ability to focus on meaningful student
            interactions.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            As a team deeply connected to the educational sector, we’ve
            experienced firsthand the dedication and behind-the-scenes work
            educators put into creating impactful learning experiences. From
            preparing tailored lesson plans to managing parent communications,
            these efforts demand immense time and energy. We understand the toll
            this takes, especially in regions where resources and support are
            often limited.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            AI Teacha was created to alleviate this burden and empower educators
            to excel where it matters most—in the classroom. By providing
            innovative AI-powered tools, we simplify the repetitive tasks, save
            time, and enable teachers to focus their passion and expertise on
            inspiring and educating their students.
          </p>
          <p className="text-lg leading-relaxed">
            Our mission is to revolutionize education in Africa, ensuring every
            teacher has the tools they need to transform lives.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default AITeachaMission;
