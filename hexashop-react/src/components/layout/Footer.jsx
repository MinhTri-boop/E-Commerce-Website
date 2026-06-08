import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaBehance } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="first-item">
              <div className="logo">
                <img src="/images/white-logo.png" alt="hexashop ecommerce templatemo" />
              </div>
              <ul>
                <li><a href="#">16501 Collins Ave, Sunny Isles Beach, FL 33160, United States</a></li>
                <li><a href="mailto:hexashop@company.com">hexashop@company.com</a></li>
                <li><a href="tel:010-020-0340">010-020-0340</a></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3">
            <h4>Shopping &amp; Categories</h4>
            <ul>
              <li><Link to="/products?category=men">Men's Shopping</Link></li>
              <li><Link to="/products?category=women">Women's Shopping</Link></li>
              <li><Link to="/products?category=kids">Kid's Shopping</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h4>Useful Links</h4>
            <ul>
              <li><Link to="/">Homepage</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Help</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h4>Help &amp; Information</h4>
            <ul>
              <li><Link to="/contact">Help</Link></li>
              <li><Link to="/contact">FAQ's</Link></li>
              <li><Link to="/contact">Shipping</Link></li>
              <li><Link to="/contact">Tracking ID</Link></li>
            </ul>
          </div>
          <div className="col-12">
            <div className="under-footer">
              <p>Copyright © 2022 HexaShop Co., Ltd. All Rights Reserved. 
                <br />Design: <a href="https://templatemo.com" target="_parent" title="free css templates">TemplateMo</a>
              </p>
              <ul>
                <li><a href="#"><FaFacebookF /></a></li>
                <li><a href="#"><FaTwitter /></a></li>
                <li><a href="#"><FaLinkedinIn /></a></li>
                <li><a href="#"><FaBehance /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
