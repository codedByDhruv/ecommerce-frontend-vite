import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => (
  <footer className="bg-white shadow-md py-12 px-6 md:px-20 lg:px-40 border-t border-gray-200">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      
      {/* 1. Branding + Social */}
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 mb-3">
          MyStore
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          &copy; 2025 MyStore. All rights reserved.
        </p>
        <div className="flex justify-center md:justify-start space-x-5">
          {[
            { Icon: Facebook, label: "Facebook", url: "#" },
            { Icon: Twitter, label: "Twitter", url: "#" },
            { Icon: Instagram, label: "Instagram", url: "#" },
            { Icon: Linkedin, label: "LinkedIn", url: "#" },
          ].map(({ Icon, label, url }) => (
            <a
              key={label}
              href={url}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
            >
              <Icon className="w-7 h-7" />
            </a>
          ))}
        </div>
      </div>

      {/* 2. Customer Service */}
      <div className="text-gray-700 space-y-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Customer Service</h3>
        <p>
          <strong>Address:</strong><br />
          1234 Market Street,<br />
          San Francisco, CA 94103, USA
        </p>
        <p>
          <strong>Phone:</strong><br />
          <a href="tel:+1234567890" className="text-blue-600 hover:underline">
            +1 (234) 567-890
          </a>
        </p>
        <p>
          <strong>Email:</strong><br />
          <a href="mailto:support@mystore.com" className="text-blue-600 hover:underline">
            support@mystore.com
          </a>
        </p>
      </div>

      {/* 3. Quick Links */}
      <div className="text-gray-700 space-y-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Quick Links</h3>
        <ul className="space-y-2">
          <li>
            <a href="/products" className="hover:text-blue-600 transition">
              Products
            </a>
          </li>
          <li>
            <a href="/cart" className="hover:text-blue-600 transition">
              Cart
            </a>
          </li>
          <li>
            <a href="/orders" className="hover:text-blue-600 transition">
              Orders
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-blue-600 transition">
              Contact Us
            </a>
          </li>
          <li>
            <a href="/faq" className="hover:text-blue-600 transition">
              FAQ
            </a>
          </li>
        </ul>
      </div>

      {/* 4. Newsletter Signup */}
      <div className="text-gray-700 space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Newsletter</h3>
        <p className="text-sm">
          Subscribe to get the latest news and exclusive offers.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </footer>
);

export default Footer;
