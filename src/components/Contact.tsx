function Contact() {
  return (
    <section className="bg-[#131416] dark:bg-[#0D0E10] py-24 sm:py-32 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Got feedback or found a bug?
        </h2>

        <p className="mt-3 text-lg text-notrated">
          We'd love to hear from you.
        </p>
        <a
          href="mailto:hello@later-app.com"
          className="inline-block mt-8 px-10 py-3 bg-white text-[#131416] font-heading font-medium hover:opacity-90 transition-opacity"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
}

export default Contact;