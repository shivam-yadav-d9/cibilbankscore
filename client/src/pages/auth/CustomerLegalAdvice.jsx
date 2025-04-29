import React from 'react';
import { Gavel, MessageSquareText, ShieldCheck, BookOpen, HelpCircle } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";

const CustomerLegalAdvice = () => {
  const { isDarkMode } = useTheme();

  // Theme-based classes
  const bgMain = isDarkMode ? "bg-slate-900" : "bg-gray-100";
  const cardBg = isDarkMode ? "bg-slate-800" : "bg-white";
  const cardShadow = isDarkMode ? "shadow-xl" : "shadow-xl";
  const cardText = isDarkMode ? "text-slate-100" : "text-blue-700";
  const descText = isDarkMode ? "text-slate-400" : "text-gray-600";
  const infoCardText = isDarkMode ? "text-slate-200" : "text-gray-700";
  const infoCardDesc = isDarkMode ? "text-slate-400" : "text-gray-600";
  const infoCardShadow = isDarkMode ? "shadow" : "shadow-sm";
  const infoCardBg = (color) => isDarkMode ? `bg-slate-900 border border-${color}-900/30` : `bg-${color}-50`;
  const sectionTitle = isDarkMode ? "text-slate-100" : "text-gray-800";
  const questionBg = isDarkMode ? "bg-slate-800" : "bg-gray-50";
  const questionTitle = isDarkMode ? "text-slate-200" : "text-gray-700";
  const questionDesc = isDarkMode ? "text-slate-400" : "text-gray-600";
  const disclaimerText = isDarkMode ? "text-slate-500" : "text-gray-500";

  return (
    <div className={`min-h-screen ${bgMain} py-10 px-4`}>
      <div className={`max-w-5xl mx-auto ${cardBg} rounded-2xl ${cardShadow} p-8`}>
        <h1 className={`text-3xl font-semibold mb-4 ${cardText}`}>Customer Legal Advice</h1>
        <p className={`mb-6 ${descText}`}>
          Facing a legal issue as a customer? Our expert team is here to guide you through your rights, contracts, fraud protection, and more. Get trusted advice to protect yourself and make informed decisions.
        </p>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className={`${isDarkMode ? "bg-slate-900 border border-blue-900/30" : "bg-blue-50"} p-5 rounded-xl text-center ${infoCardShadow}`}>
            <Gavel size={32} className="text-blue-600 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${infoCardText}`}>Legal Rights</h3>
            <p className={`text-sm ${infoCardDesc}`}>Know your rights as a consumer under law and how to assert them confidently.</p>
          </div>
          <div className={`${isDarkMode ? "bg-slate-900 border border-green-900/30" : "bg-green-50"} p-5 rounded-xl text-center ${infoCardShadow}`}>
            <MessageSquareText size={32} className="text-green-600 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${infoCardText}`}>Contract Review</h3>
            <p className={`text-sm ${infoCardDesc}`}>Need help with contract terms? We offer quick, reliable reviews before you commit.</p>
          </div>
          <div className={`${isDarkMode ? "bg-slate-900 border border-yellow-900/30" : "bg-yellow-50"} p-5 rounded-xl text-center ${infoCardShadow}`}>
            <ShieldCheck size={32} className="text-yellow-600 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${infoCardText}`}>Fraud Protection</h3>
            <p className={`text-sm ${infoCardDesc}`}>Victim of a scam or unauthorized charge? Learn what steps to take and your legal options.</p>
          </div>
          <div className={`${isDarkMode ? "bg-slate-900 border border-purple-900/30" : "bg-purple-50"} p-5 rounded-xl text-center ${infoCardShadow}`}>
            <BookOpen size={32} className="text-purple-600 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${infoCardText}`}>Consumer Laws</h3>
            <p className={`text-sm ${infoCardDesc}`}>Stay informed about the latest consumer protection laws and how they affect you.</p>
          </div>
          <div className={`${isDarkMode ? "bg-slate-900 border border-red-900/30" : "bg-red-50"} p-5 rounded-xl text-center ${infoCardShadow}`}>
            <HelpCircle size={32} className="text-red-600 mx-auto mb-2" />
            <h3 className={`text-lg font-semibold ${infoCardText}`}>Need Legal Help?</h3>
            <p className={`text-sm ${infoCardDesc}`}>Our support team is here to connect you with the right legal resources.</p>
          </div>
        </div>

        {/* Common Legal Questions */}
        <div className="space-y-6">
          <h2 className={`text-2xl font-semibold ${sectionTitle}`}>Common Legal Questions</h2>

          <div className={`${questionBg} p-4 rounded-lg ${infoCardShadow}`}>
            <h3 className={`text-lg font-medium ${questionTitle}`}>What are my rights if I receive a defective product?</h3>
            <p className={questionDesc}>
              You may be entitled to a repair, replacement, or refund depending on the seller’s return policy and consumer protection laws.
            </p>
          </div>

          <div className={`${questionBg} p-4 rounded-lg ${infoCardShadow}`}>
            <h3 className={`text-lg font-medium ${questionTitle}`}>How can I resolve a dispute over service terms?</h3>
            <p className={questionDesc}>
              Review your service agreement thoroughly. Communicate your concerns with the provider. If unresolved, consider filing a complaint with a consumer protection agency.
            </p>
          </div>

          <div className={`${questionBg} p-4 rounded-lg ${infoCardShadow}`}>
            <h3 className={`text-lg font-medium ${questionTitle}`}>What should I do if I was scammed?</h3>
            <p className={questionDesc}>
              Report the fraud to your bank, local police, and national cybercrime portals. Keep records and seek legal advice if needed.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 text-center">
          <p className={`text-sm italic ${disclaimerText}`}>
            Disclaimer: This content is for general informational purposes only and does not substitute professional legal advice. For specific concerns, consult a licensed attorney.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerLegalAdvice;