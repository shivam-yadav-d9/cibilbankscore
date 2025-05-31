function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
           <img
                src="/logo2.png"
                alt="Logo"
                className={`transition-all duration-500 w-auto filter drop-shadow-lg h-14`}
          />
          <p className="mt-2 text-sm">
            Secure and trusted banking solutions to help you manage your
            financial future.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="hover:text-blue-400">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Services
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Banking Services */}
        <div>
          <h3 className="text-lg font-semibold text-white">Our Services</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <a href="#" className="hover:text-blue-400">
                Personal Banking
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Loans & Credit
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Wealth Management
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400">
                Business Banking
              </a>
            </li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="text-lg font-semibold text-white">Customer Support</h3>
          <p className="mt-2 text-sm">Need help? Contact us 24/7.</p>
          <p className="mt-1">
            📞+91 8062179504<span className="font-semibold"></span>
          </p>
          <p className="mt-1">✉️ care@dbnpe.in</p>
          <p className="mt-1">
            addresh- 20/1, Indira Nagar Bangalore- 560038, Karnataka, India
          </p>
        </div>
      </div>
      {/* addresh - 20/1, Indira Nagar
      Bangalore - 560038,
      Karnataka, India */}
      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} DBNPE.in All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
