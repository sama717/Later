import aboutImg from "../assets/about-img.png";

function About() {
  return (
    <section className="relative bg-background pt-24 sm:pt-32 pb-0 text-center overflow-hidden">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl font-medium text-foreground">
          About
        </h2>

        <p className="mt-3 text-lg text-muted-foreground">
          Every "I'll play that later" finally has a home.
        </p>

        <button className="inline-block mt-8 px-10 py-3 bg-primary text-primary-foreground font-heading font-medium hover:opacity-90 transition-opacity cursor-pointer">
          Read More
        </button>
      </div>

      <div className="mt-24 max-w-5xl mx-auto px-4">
        <img
          src={aboutImg}
          alt="Preview of the Library section showing saved games"
          className="w-full h-auto max-h-50 sm:max-h-135 object-cover object-top"
        />
      </div>
    </section>
  );
}

export default About;