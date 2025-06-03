import React, { useState, useEffect } from 'react';
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
            className="w-6 h-6 text-indigo-500"
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
    const [isLoading, setIsLoading] = useState(true);
    const [animateCards, setAnimateCards] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => setAnimateCards(true), 100);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    if (!documents || !documents.length || !documents[0].docs) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-800">
                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl text-center shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105">
                    <div className="mb-6 text-white/80">
                        <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">No Documents Found</h2>
                    <p className="text-blue-100 mb-6">We couldn't find any documents for this loan application.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center gap-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Return to Dashboard
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-800">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white/30 mx-auto mb-4"></div>
                    <p className="text-lg text-white/80">Loading documents...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-800 py-12 px-4 pt-20">
            <div className="max-w-6xl mx-auto">
                {/* Floating Header */}
                <div className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl mb-10 p-6 border border-white/20 transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h1 className="text-3xl font-bold text-white">
                                    Required Documents
                                </h1>
                            </div>
                            <p className="text-blue-200 ml-1">
                                {documents[0].name || 'Loan Application'} Documentation Checklist
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search documents..."
                                        className="pl-10 pr-4 py-3 bg-black/20 backdrop-blur-md border border-white/20 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-64 text-white placeholder-white/60"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <svg
                                        className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2"
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
                            </div>
                            <button
                                onClick={() => navigate(-1)}
                                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
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

                {/* Stats Summary */}
                <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 transform transition-all duration-700 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{filteredDocs.length}</div>
                            <div className="text-xs text-blue-200">Total Documents</div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-600/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{filteredDocs.length}</div>
                            <div className="text-xs text-blue-200">Required</div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-600/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">0</div>
                            <div className="text-xs text-blue-200">Completed</div>
                        </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-600/30 flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">0%</div>
                            <div className="text-xs text-blue-200">Progress</div>
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map(([key, value], index) => (
                        <div
                            key={key}
                            className={`group bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-1 transition-all duration-300 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-md rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <DocumentIcon type={key} />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300 truncate">
                                                    {getDocumentValue(value)}
                                                </h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-200 border border-red-500/30">
                                                    Required
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-white/10 text-blue-100 border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-colors duration-300">
                                                    {key.split('_').join(' ')}
                                                </span>
                                            </div>
                                            {(key === "6_MONTHS_BANK_STATEMENT" || key === "1_YEAR_BANK_STATEMENT") && (
                                                <p className="mt-2 text-sm text-blue-200">
                                                    Latest bank statement with bank seal and signature
                                                </p>
                                            )}
                                            {key === "3_MONTHS_SALARY_SLIP" && (
                                                <p className="mt-2 text-sm text-blue-200">
                                                    Last 3 months salary slips with company seal
                                                </p>
                                            )}
                                            {typeof value === 'object' && value?.description && (
                                                <p className="mt-2 text-sm text-blue-200">
                                                    {value.description}
                                                </p>
                                            )}
                                            <div className="mt-4 flex justify-end">
                                                <button className="px-3 py-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-200 rounded-lg border border-indigo-500/30 flex items-center gap-1 transition-colors duration-300">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                    </svg>
                                                    Upload
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Cards */}
                <div className={`mt-12 grid md:grid-cols-2 gap-6 transform transition-all duration-700 delay-300 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Important Notes */}
                    <div className="bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Important Notes</h3>
                            </div>
                            <ul className="space-y-3 text-blue-100">
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    All documents should be clear and legible
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Documents should be valid and not expired
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    Ensure all pages of multi-page documents are included
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/10 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Need Help?</h3>
                            </div>
                            <p className="text-blue-100">
                                If you need assistance gathering these documents or have questions,
                                contact our support team:
                            </p>
                            <div className="mt-6 space-y-3">
                                <a href="mailto:support@example.com" className="flex items-center gap-3 text-indigo-300 hover:text-indigo-200 group-hover:translate-x-1 transition-transform duration-300">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    ✉️ info@dbnpe.in                                </a>
                                <a href="tel:1800XXXXXXX" className="flex items-center gap-3 text-indigo-300 hover:text-indigo-200 group-hover:translate-x-1 transition-transform duration-300">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    📞+91 8062179504                                </a>
                                <button className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Chat with AI Assistant
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className={`mt-12 text-center text-blue-200/60 text-sm transform transition-all duration-700 delay-500 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <p>© 2025 Loan Processing System. All rights reserved.</p>
                    <div className="mt-2 flex justify-center space-x-4">
                        <a href="#" className="text-blue-300/70 hover:text-blue-200 transition-colors duration-300">Privacy Policy</a>
                        <a href="#" className="text-blue-300/70 hover:text-blue-200 transition-colors duration-300">Terms of Service</a>
                        <a href="#" className="text-blue-300/70 hover:text-blue-200 transition-colors duration-300">Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDocumentsPage;