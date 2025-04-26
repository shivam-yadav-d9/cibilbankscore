import { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const itemsPerPage = 8;

  // Mock data - replace with actual API call in production
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      const mockTransactions = [
        {
          id: "TXN-12345",
          date: "2025-04-20",
          amount: 450.00,
          description: "Service Package Premium",
          status: "completed",
          paymentMethod: "Credit Card",
          invoice: "INV-2025-04-001"
        },
        {
          id: "TXN-12346",
          date: "2025-04-15",
          amount: 120.50,
          description: "Additional Services",
          status: "completed",
          paymentMethod: "Debit Card",
          invoice: "INV-2025-04-002"
        },
        {
          id: "TXN-12347",
          date: "2025-04-10",
          amount: 299.99,
          description: "Monthly Subscription",
          status: "completed",
          paymentMethod: "Bank Transfer",
          invoice: "INV-2025-04-003"
        },
        {
          id: "TXN-12348",
          date: "2025-04-05",
          amount: 79.99,
          description: "Add-on Service",
          status: "completed",
          paymentMethod: "Credit Card",
          invoice: "INV-2025-04-004"
        },
        {
          id: "TXN-12349",
          date: "2025-03-28",
          amount: 199.50,
          description: "Consultation Fee",
          status: "completed",
          paymentMethod: "PayPal",
          invoice: "INV-2025-03-001"
        },
        {
          id: "TXN-12350",
          date: "2025-03-20",
          amount: 45.00,
          description: "Service Add-on",
          status: "pending",
          paymentMethod: "Credit Card",
          invoice: "INV-2025-03-002"
        },
        {
          id: "TXN-12351",
          date: "2025-03-15",
          amount: 350.00,
          description: "Premium Package",
          status: "completed",
          paymentMethod: "Debit Card",
          invoice: "INV-2025-03-003"
        },
        {
          id: "TXN-12352",
          date: "2025-03-10",
          amount: 79.99,
          description: "Monthly Maintenance",
          status: "failed",
          paymentMethod: "Credit Card",
          invoice: "INV-2025-03-004"
        },
        {
          id: "TXN-12353",
          date: "2025-03-05",
          amount: 149.99,
          description: "Service Upgrade",
          status: "completed",
          paymentMethod: "Bank Transfer",
          invoice: "INV-2025-03-005"
        },
        {
          id: "TXN-12354",
          date: "2025-02-28",
          amount: 299.99,
          description: "Annual Subscription - Partial",
          status: "completed",
          paymentMethod: "Credit Card",
          invoice: "INV-2025-02-001"
        }
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = selectedStatus === "all" || transaction.status === selectedStatus;
    
    // Date filter
    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = matchesDate && new Date(transaction.date) >= new Date(dateRange.from);
    }
    if (dateRange.to) {
      matchesDate = matchesDate && new Date(transaction.date) <= new Date(dateRange.to);
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleDownloadInvoice = (invoiceId) => {
    // Handle invoice download
    console.log(`Downloading invoice ${invoiceId}`);
  };

  // Status badge color mapping
  const statusColors = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800"
  };

  // Format date to display better
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ from: "", to: "" });
    setSelectedStatus("all");
    setFilterOpen(false);
  };

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
            <p className="text-gray-600 mt-1">View and manage your transaction history</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0 w-full md:w-auto">
            {/* Search box */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors w-full md:w-auto"
            >
              <FiFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {filterOpen && (
          <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : paginatedTransactions.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg">No transactions found</p>
            <p className="text-gray-400 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[transaction.status]}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDownloadInvoice(transaction.invoice)}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          <FiDownload className="mr-1" /> Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(startIndex + itemsPerPage, filteredTransactions.length)}
                      </span>{" "}
                      of <span className="font-medium">{filteredTransactions.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Previous</span>
                        <FiChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Next</span>
                        <FiChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
                
                {/* Mobile pagination */}
                <div className="flex items-center justify-between w-full sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  <p className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </p>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}