import React from 'react';
import { Gavel, MessageSquareText, ShieldCheck, BookOpen, HelpCircle } from 'lucide-react';

const CustomerLegalAdvice = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-semibold text-blue-700 mb-4">Customer Legal Advice</h1>
        <p className="text-gray-600 mb-6">
          Facing a legal issue as a customer? Our expert team is here to guide you through your rights, contracts, fraud protection, and more. Get trusted advice to protect yourself and make informed decisions.
        </p>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 p-5 rounded-xl text-center shadow-sm">
            <Gavel size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Legal Rights</h3>
            <p className="text-sm text-gray-600">Know your rights as a consumer under law and how to assert them confidently.</p>
          </div>
          <div className="bg-green-50 p-5 rounded-xl text-center shadow-sm">
            <MessageSquareText size={32} className="text-green-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Contract Review</h3>
            <p className="text-sm text-gray-600">Need help with contract terms? We offer quick, reliable reviews before you commit.</p>
          </div>
          <div className="bg-yellow-50 p-5 rounded-xl text-center shadow-sm">
            <ShieldCheck size={32} className="text-yellow-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Fraud Protection</h3>
            <p className="text-sm text-gray-600">Victim of a scam or unauthorized charge? Learn what steps to take and your legal options.</p>
          </div>
          <div className="bg-purple-50 p-5 rounded-xl text-center shadow-sm">
            <BookOpen size={32} className="text-purple-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Consumer Laws</h3>
            <p className="text-sm text-gray-600">Stay informed about the latest consumer protection laws and how they affect you.</p>
          </div>
          <div className="bg-red-50 p-5 rounded-xl text-center shadow-sm">
            <HelpCircle size={32} className="text-red-600 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-700">Need Legal Help?</h3>
            <p className="text-sm text-gray-600">Our support team is here to connect you with the right legal resources.</p>
          </div>
        </div>

        {/* Common Legal Questions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Common Legal Questions</h2>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">What are my rights if I receive a defective product?</h3>
            <p className="text-gray-600">
              You may be entitled to a repair, replacement, or refund depending on the seller’s return policy and consumer protection laws.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">How can I resolve a dispute over service terms?</h3>
            <p className="text-gray-600">
              Review your service agreement thoroughly. Communicate your concerns with the provider. If unresolved, consider filing a complaint with a consumer protection agency.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">What should I do if I was scammed?</h3>
            <p className="text-gray-600">
              Report the fraud to your bank, local police, and national cybercrime portals. Keep records and seek legal advice if needed.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Disclaimer: This content is for general informational purposes only and does not substitute professional legal advice. For specific concerns, consult a licensed attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLegalAdvice;
