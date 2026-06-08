import { FaInstagram } from 'react-icons/fa';

const SocialMedia = () => {
  const images = [
    { src: '/images/instagram-01.jpg', alt: 'Fashion', title: 'Fashion' },
    { src: '/images/instagram-02.jpg', alt: 'New', title: 'New' },
    { src: '/images/instagram-03.jpg', alt: 'Brand', title: 'Brand' },
    { src: '/images/instagram-04.jpg', alt: 'Makeup', title: 'Makeup' },
    { src: '/images/instagram-05.jpg', alt: 'Leather', title: 'Leather' },
    { src: '/images/instagram-06.jpg', alt: 'Bag', title: 'Bag' }
  ];

  return (
    <section className="section" id="social">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-heading">
              <h2>Social Media</h2>
              <span>Details to details is what makes Hexashop different from the other themes.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row images">
          {images.map((image, index) => (
            <div className="col-2" key={index}>
              <div className="thumb">
                <div className="icon">
                  <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                    <h6>{image.title}</h6>
                    <FaInstagram />
                  </a>
                </div>
                <img src={image.src} alt={image.alt} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
