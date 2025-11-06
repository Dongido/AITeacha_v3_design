import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import mission from "../../../assets/img/mission.jpg"
const AITeachaMission = () => {
  return (
    <>
      <Navbar />

      <section className="text-gray-800 py-24 p-4 ">
        <section className="relative rounded-2xl bg-blight w-full h-[60vh] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden">
        
                  <img src={mission} alt="" className="w-full h-full absolute object-cover max-w-full"/>
                  <div className="absolute w-full h-full bg-[#2E096399] z-20" /> 
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section>
            <figcaption className="desc z-20 relative">
              <h1 className="text-6xl font-bold text-center my-6 text-header text-white">
                {" "}
                AiTeacha Mission
              </h1>
              <p className="text-gray-100 mb-8 px-2 text-sm md:text-lg xl:text-lg text-center">
                Saving educators time, ensuring they have the tools and
                resources they need to transform lives
              </p>
            </figcaption>
          </section>
        </section>

        <div className="max-w-5xl mx-auto mt-[30px]  md:mt-[100px] px-6">
          <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold text-primary mt-6 text-center mb-6"></h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="text-lg font-bold"> Our Mission &nbsp;</span>
            is to revolutionize education by empowering educators with
            innovative AI-powered tools that simplify teaching, enhance
            personalized learning, and make quality educational resources
            accessible, fostering transformative, efficient, and impactful
            learning experiences across Africa and beyond.
          </p>
          <p className="text-lg leading-relaxed mb-8">
            At AiTeacha, we recognize the unique challenges facing educators in
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
            AiTeacha was created to alleviate this burden and empower educators
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
