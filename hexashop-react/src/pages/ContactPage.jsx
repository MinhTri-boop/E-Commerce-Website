import { useState } from 'react';
import Subscribe from '../components/layout/Subscribe';
import { FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      alert(`Thank you for your message, ${formData.name}! We will get back to you shortly.`);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <>
      <div className="page-heading about-page-heading" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <h2>Contact Us</h2>
                <span>Awesome, clean &amp; creative HTML5 Template</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-us">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div id="map">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90186.37207676383!2d-80.13495239500924!3d25.9317678710111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9ad1877e4a82d%3A0xa891114b9840c8fd!2sSunny%20Isles%20Beach%2C%20FL%2033160%2C%20USA!5e0!3m2!1sen!2sth!4v1613933820922!5m2!1sen!2sth" 
                  width="100%" 
                  height="400px" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-heading">
                <h2>Say Hello. Don't Be Shy!</h2>
                <span>Details to details is what makes Hexashop different from the other themes.</span>
              </div>
              <form id="contact" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-6">
                    <fieldset>
                      <input 
                        name="name" 
                        type="text" 
                        id="name" 
                        placeholder="Your name" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6">
                    <fieldset>
                      <input 
                        name="email" 
                        type="email" 
                        id="email" 
                        placeholder="Your email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <textarea 
                        name="message" 
                        rows="6" 
                        id="message" 
                        placeholder="Your message" 
                        required
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </fieldset>
                  </div>
                  <div className="col-lg-12">
                    <fieldset>
                      <button type="submit" id="form-submit" className="main-dark-button">
                        <FaPaperPlane /> Send Message
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Subscribe />
    </>
  );
};

export default ContactPage;
