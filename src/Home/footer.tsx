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
import { supabase } from "../lib/supabase";

const Footer: React.FC = (): JSX.Element => {
  const year = new Date().getFullYear();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || loading) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("subscribers")
        .insert([{ email }]);

      if (error) {
        console.log("Supabase error:", error);
        alert(error.message || "Subscription failed");
        return;
      }

      setEmail("");
      alert("Subscribed successfully!");
    } catch (err) {
      console.log("Unexpected error:", err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-20 sm:mt-24" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

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
              <span className="text-blue-400">S</span>harK
            </h3>

            <p className="text-sm text-gray-300 mt-4 leading-relaxed">
              Discover high-quality products from trusted sellers worldwide.
              Fast delivery and secure checkout guaranteed.
            </p>

            <address className="mt-5 space-y-2 text-sm text-gray-400 not-italic">
              <p className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:support@shark.com" className="hover:text-blue-400">
                  bksraut27@gmail.com
                </a>
              </p>

              <p className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+44123456789" className="hover:text-blue-400">
                  +44 078 877 309
                </a>
              </p>

              <p className="flex items-center gap-2">
                <MapPin size={16} />
                London, UK
              </p>
            </address>
          </section>

          {/* SHOP */}
          <nav aria-label="Shop navigation">
            <h3 className="font-semibold mb-4 text-white">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link to="/search" className="hover:text-blue-400">Browse Products</Link></li>
              <li><Link to="/trending" className="hover:text-blue-400">Trending</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400">Cart</Link></li>
            </ul>
          </nav>

          {/* SUPPORT */}
          <nav aria-label="Support navigation">
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/help" className="hover:text-blue-400">Help Center</a></li>
              <li><a href="/shipping" className="hover:text-blue-400">Shipping Info</a></li>
              <li><a href="/returns" className="hover:text-blue-400">Returns & Refunds</a></li>
              <li><a href="/privacy" className="hover:text-blue-400">Privacy Policy</a></li>
            </ul>
          </nav>

          {/* NEWSLETTER */}
          <section>
            <h3 className="font-semibold mb-4 text-white">
              Stay Updated
            </h3>

            <p className="text-sm text-gray-300 mb-3">
              Subscribe for latest offers & updates.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center rounded-lg overflow-hidden bg-white/10 border border-white/20 backdrop-blur-md">

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-base sm:text-sm bg-transparent outline-none text-white placeholder-gray-400"
                />

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full sm:w-auto bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 active:scale-95 transition disabled:opacity-50"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>

              </div>
            </form>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6 justify-center sm:justify-start">
              <a href="https://facebook.com"><Facebook size={18} /></a>
              <a href="https://instagram.com"><Instagram size={18} /></a>
              <a href="https://twitter.com"><Twitter size={18} /></a>
            </div>
          </section>
        </div>

        {/* BOTTOM */}
        <div className="mt-10 sm:mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4 text-center sm:text-left">
          <p>© {year} SharK. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <ShoppingCart size={16} />
            <span>Secure shopping experience</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;