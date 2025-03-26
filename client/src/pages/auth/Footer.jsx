function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-semibold text-white">DBNPAY!</h2>
            <p className="mt-2 text-sm">
              Secure and trusted banking solutions to help you manage your financial future.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-blue-400">Home</a></li>
              <li><a href="#" className="hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400">Services</a></li>
              <li><a href="#" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
  
          {/* Banking Services */}
          <div>
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="hover:text-blue-400">Personal Banking</a></li>
              <li><a href="#" className="hover:text-blue-400">Loans & Credit</a></li>
              <li><a href="#" className="hover:text-blue-400">Wealth Management</a></li>
              <li><a href="#" className="hover:text-blue-400">Business Banking</a></li>
            </ul>
          </div>
  
          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold text-white">Customer Support</h3>
            <p className="mt-2 text-sm">Need help? Contact us 24/7.</p>
            <p className="mt-1">📞 <span className="font-semibold">1800-123-4567</span></p>
            <p className="mt-1">✉️ support@bankcorp.com</p>
          </div>
        </div>
  
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} BankCorp. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  
  export default Footer;