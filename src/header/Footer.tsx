import React, { type JSX } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import NewsletterForm from "./NewsletterForm";

const Footer: React.FC = (): JSX.Element => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 sm:mt-24" aria-labelledby="footer-heading">

      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-gray-900 to-black z-0"
      />

      {/* CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 overflow-x-hidden backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">

          {/* BRAND */}
          <section>
            <h3 className="text-2xl font-bold text-white">
              <span>
          <span className="text-blue-600">M</span>
          <span className="text-black">ithila</span>{" "}
          <span className="text-blue-600">S</span>
          <span className="text-black">tore</span>
        </span>
            </h3>

            <p className="text-sm text-gray-300 mt-4 leading-relaxed">
              Discover high-quality products from trusted sellers worldwide.
              Fast delivery and secure checkout guaranteed.
            </p>

            <address className="mt-5 space-y-2 text-sm text-gray-400 not-italic">
              <p className="flex items-center gap-2">
                <Mail size={16} /> bksraut27@gmail.com
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} /> +44 788 778 0309
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={16} /> London, UK
              </p>
            </address>
          </section>

          {/* SHOP */}
          <nav aria-label="Shop navigation">
            <h3 className="font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search">Browse Products</Link></li>
              <li><Link to="/trending">Trending</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </nav>

          {/* SUPPORT */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/returns">Returns & Refunds</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </nav>

          {/* NEWSLETTER + SOCIAL */}
          <div className="space-y-6">

            <NewsletterForm />

            {/* SOCIAL */}
            <div className="flex gap-4 mt-2">
              <a href="https://facebook.com" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4 text-center sm:text-left">

      <p>© {year} SharK. All rights reserved.</p>

  <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">

    <div className="flex items-center gap-2">
      <ShoppingCart size={16} />
      <span>Secure shopping experience</span>
    </div>

    <div className="flex items-center gap-2 ml-2">
      <span className="text-xs text-gray-400">We accept:</span>

      <img
    src="https://api.iconify.design/logos:visa.svg"
    alt="Visa"
    className="h-5 w-auto opacity-80 hover:opacity-100 transition"
  />

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/0c/MasterCard_logo.png"
        className="h-4 w-auto opacity-80"
        alt="Mastercard"
      />
    </div>

  </div>
</div>
        

      </div>
    </footer>
  );
};

export default Footer;