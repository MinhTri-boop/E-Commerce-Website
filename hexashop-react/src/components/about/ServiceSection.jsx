const ServiceSection = () => {
  const services = [
    {
      title: "Synther Vaporware",
      description: "Lorem ipsum dolor sit amet, consecteturti adipiscing elit, sed do eiusmod temp incididunt ut labore, et dolore quis ipsum suspend.",
      image: "/images/service-01.jpg"
    },
    {
      title: "Locavore Squidward",
      description: "Lorem ipsum dolor sit amet, consecteturti adipiscing elit, sed do eiusmod temp incididunt ut labore, et dolore quis ipsum suspend.",
      image: "/images/service-02.jpg"
    },
    {
      title: "Health Gothfam",
      description: "Lorem ipsum dolor sit amet, consecteturti adipiscing elit, sed do eiusmod temp incididunt ut labore, et dolore quis ipsum suspend.",
      image: "/images/service-03.jpg"
    }
  ];

  return (
    <section className="our-services">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading">
              <h2>Our Services</h2>
              <span>Details to details is what makes Hexashop different from the other themes.</span>
            </div>
          </div>
          {services.map((service, index) => (
            <div className="col-lg-4" key={index}>
              <div className="service-item">
                <h4>{service.title}</h4>
                <p>{service.description}</p>
                <img src={service.image} alt={service.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
