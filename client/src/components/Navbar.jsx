import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/test", label: "Test" },
    { path: "/pricing", label: "Pricing" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div className="relative z-50 bg-[#697565] backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">TestifyAI</span>
          </Link>

          {/* Right Side: nav links + actions */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <nav className="flex items-center space-x-8">
              {navLinks.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `transition-colors ${
                      isActive ? "text-white" : "text-white/80 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/signin"
              className="bg-white-200 rounded-lg transition-all transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-b border-white/20">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-white/80 hover:text-white"
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-white/20">
              <Link
                to="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left text-white/80 hover:text-white mb-3"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                onClick={() => setIsMenuOpen(false)}
                className="w-full block text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
