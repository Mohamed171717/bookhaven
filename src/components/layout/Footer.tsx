

import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#3d3a37] text-gray-300 pt-12 pb-4 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-6">
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">About BookHaven</h3>
          <p className="text-gray-400 leading-relaxed">
            Your community for discovering, <br />
            trading, and sharing stories.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Shop</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Trade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Swap</a></li>
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">Customer Service</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">Connect With Us</h3>
          <div className="flex gap-3 mt-2">
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaPinterestP />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-600 my-3" />

      <div className="text-center text-gray-400 text-xs px-4 md:px-6">
        © 2025 BookHaven. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


export const SmallFooter = () => {
  return (
    <footer className="bg-[#3d3a37] text-gray-300 py-2 text-sm">
      <div className="text-center text-gray-400 my-[7px] text-xs px-4 md:px-6">
        © 2025 BookHaven. All rights reserved.
      </div>
    </footer>
  );
};

