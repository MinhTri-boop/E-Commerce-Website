import { FaFacebookF, FaTwitter, FaLinkedinIn, FaBehance } from 'react-icons/fa';

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Ragnar Lodbrok",
      role: "Product Caretaker",
      image: "/images/team-member-01.jpg"
    },
    {
      name: "Ragnar Lodbrok",
      role: "Product Caretaker",
      image: "/images/team-member-02.jpg"
    },
    {
      name: "Ragnar Lodbrok",
      role: "Product Caretaker",
      image: "/images/team-member-03.jpg"
    }
  ];

  return (
    <section className="our-team">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading">
              <h2>Our Amazing Team</h2>
              <span>Details to details is what makes Hexashop different from the other themes.</span>
            </div>
          </div>
          {teamMembers.map((member, index) => (
            <div className="col-lg-4" key={index}>
              <div className="team-item">
                <div className="thumb">
                  <div className="hover-effect">
                    <div className="inner-content">
                      <ul>
                        <li><a href="#"><FaFacebookF /></a></li>
                        <li><a href="#"><FaTwitter /></a></li>
                        <li><a href="#"><FaLinkedinIn /></a></li>
                        <li><a href="#"><FaBehance /></a></li>
                      </ul>
                    </div>
                  </div>
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="down-content">
                  <h4>{member.name}</h4>
                  <span>{member.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
