import TeamSection from '../components/about/TeamSection';
import ServiceSection from '../components/about/ServiceSection';
import Subscribe from '../components/layout/Subscribe';
import { FaQuoteLeft } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <>
      <div className="page-heading about-page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>About Our Company</h2>
                <span>Awesome, clean &amp; creative HTML5 Template</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="left-image">
                <img src="/images/about-left-image.jpg" alt="About Us" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-content">
                <h4>About Us &amp; Our Skills</h4>
                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod kon tempor incididunt ut labore.</span>
                <div className="quote">
                  <FaQuoteLeft />
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiuski smod kon tempor incididunt ut labore.</p>
                </div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod kon tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p>
                <ul>
                  <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                  <li><a href="#"><i className="fa fa-behance"></i></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TeamSection />
      
      <ServiceSection />
      
      <Subscribe />
    </>
  );
};

export default AboutPage;
