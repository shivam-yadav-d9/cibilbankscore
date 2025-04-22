import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DocumentIcon = ({ type }) => {
    const getIcon = () => {
        switch (type) {
            case 'AADHAAR_CARD':
            case 'AADHAAR_CARD_FRONT':
            case 'AADHAAR_CARD_BACK':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                );
            case 'PAN_CARD':
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                );
            default:
                return (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                );
        }
    };

    return (
        <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            {getIcon()}
        </svg>
    );
};

const LoanDocumentsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { documents, loanName } = location.state || {};
    const [searchTerm, setSearchTerm] = useState('');

    if (!documents || !documents.length || !documents[0].docs) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">No documents found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const loanDocs = documents[0].docs;
    const filteredDocs = Object.entries(loanDocs).filter(([key, value]) => {
        const searchValue = typeof value === 'string' ? value : value?.name || value?.description || '';
        return searchValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
               key.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const getDocumentValue = (value) => {
        if (typeof value === 'string') return value;
        if (typeof value === 'object' && value !== null) {
            return value.name || value.description || JSON.stringify(value);
        }
        return 'Document Required';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 mt-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg mb-8 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Required Documents
                            </h1>
                            <p className="text-gray-600">
                                {documents[0].name || 'Loan Application'} Documentation Checklist
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full md:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg
                                    className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back
                            </button>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map(([key, value]) => (
                        <div
                            key={key}
                            className="bg-white/80 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                                            <DocumentIcon type={key} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {getDocumentValue(value)}
                                            </h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                Required
                                            </span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                {key.split('_').join(' ')}
                                            </span>
                                        </div>
                                        {(key === "6_MONTHS_BANK_STATEMENT" || key === "1_YEAR_BANK_STATEMENT") && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                Latest bank statement with bank seal and signature
                                            </p>
                                        )}
                                        {key === "3_MONTHS_SALARY_SLIP" && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                Last 3 months salary slips with company seal
                                            </p>
                                        )}
                                        {typeof value === 'object' && value?.description && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                {value.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Cards */}
                <div className="mt-8 grid md:grid-cols-2 gap-6">
                    {/* Important Notes */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-yellow-900">Important Notes</h3>
                        </div>
                        <ul className="space-y-2 text-yellow-800">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                All documents should be clear and legible
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Documents should be valid and not expired
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Ensure all pages of multi-page documents are included
                            </li>
                        </ul>
                    </div>

                    {/* Help Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
                        </div>
                        <p className="text-blue-800">
                            If you need assistance gathering these documents or have questions, 
                            please contact our support team:
                        </p>
                        <div className="mt-4 space-y-2">
                            <a href="mailto:support@example.com" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                support@example.com
                            </a>
                            <a href="tel:1800XXXXXXX" className="flex items-center gap-2 text-blue-700 hover:text-blue-800">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                1-800-XXX-XXXX
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDocumentsPage;