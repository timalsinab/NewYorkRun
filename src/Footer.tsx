// Footer.js
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3>READY FOR YOUR NEXT RUN?</h3>
        <p>coffeerun@gmail.com</p>
      </div>
      <div className="footer-center">
        <a href="#linkedin" className="social-icon linkedin">LinkedIn</a>
        <a href="#instagram" className="social-icon instagram">Instagram</a>
        <a href="#facebook" className="social-icon facebook">Facebook</a>
      </div>
      <div className="footer-right">
        <a href="#terms">Terms & Condition</a>
        <a href="#privacy">Privacy Policy</a>
      </div>
    </footer>
  );
}
