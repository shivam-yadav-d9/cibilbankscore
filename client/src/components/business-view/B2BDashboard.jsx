import React from "react";

import {
  Banknote, CreditCard, ReceiptText, ShieldCheck, PiggyBank,
  Coins, Fingerprint, SendHorizontal, Building, Landmark,
  Gavel, UserPlus, FileText, Truck, HeartPulse, Pill,
  HandHelping, CalendarCheck2, DollarSign, MonitorSmartphone
} from "lucide-react";

const B2BDashboard = () => {
  return (
    <>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-12 gap-5 flex-col-reverse md:flex-row text-center md:text-left mt-16">
        <div className="left">
          <h1 className="text-2xl md:text-5xl text-crimson">
            Our aim is to provide <span className="font-bold text-blue-500">Business</span> <br />
            with everything they need to manage their finances in one place
          </h1>
          <p className="text-gray-800 text-base md:text-lg my-4 pt-2">
          B2B banking helps businesses grow by bringing a whole new perspective to payment methods. It also accelerates international transaction processes.
          </p>
          <button className="text-white bg-crimson py-2 px-4 text-base md:text-lg rounded hover:bg-red-700 transition mt-4">
            Get Start
          </button>
        </div>
        <div className="right mt-5 md:mt-0">
          <img src="/image.png" alt="Hero Image" className="max-w-full w-full h-auto" />
        </div>
      </div>

      {/* Full-Width Image Section */}
      <div className="max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center p-6 md:p-12 gap-8 mt-10 sm:mt-1">
        <div className="w-full">
          <img
            src="/b2b2.png"
            alt="B2B Full Image"
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
        </div>
      </div>

      {/* Paragraph Section with Responsive Font Size */}
      <div className="max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row justify-between items-center p-6 md:p-12 gap-8">
        <p className="text-base md:text-lg lg:text-2xl font-semibold leading-snug text-gray-800 text-center md:text-left">
          <span className="font-semibold text-crimson">B2B banking</span>, where efficient and fast transactions are carried out, is the purchase and sale transactions carried out between more than one corporate account, at least two.
          <span className=" font-semibold text-blue-500">B2B in digital banking</span> is an electronic service created to facilitate commercial payments or transactions between companies or institutions and to aggregate them on a single digital platform.
        </p>
      </div>



      {/* Responsive h2 Section */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 my-8">
        <h2 className="text-center font-bold text-crimson text-2xl md:text-4xl lg:text-5xl">
          B2B Banking Services in DBNpe Pvt. Ltd
        </h2>

        <div className="w-full min-h-screen py-12 px-6">
          <h2 className="text-center font-bold text-sky-950 text-2xl md:text-4xl lg:text-5xl pb-10">Our Services</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Banknote size={50} />
              </div>
              <span className="font-semibold text-lg">Loan</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <CreditCard size={50} />
              </div>
              <span className="font-semibold text-lg">Credit Card</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <ReceiptText size={50} />
              </div>
              <span className="font-semibold text-lg">Bill Payment</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <ShieldCheck size={50} />
              </div>
              <span className="font-semibold text-lg">Insurance</span>
            </div>

            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <PiggyBank size={50} />
              </div>
              <span className="font-semibold text-lg">FD (Fixed Deposit)</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Coins size={50} />
              </div>
              <span className="font-semibold text-lg">RD (Recurring Deposit)</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Fingerprint size={50} />
              </div>
              <span className="font-semibold text-lg">AEPS</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <SendHorizontal size={50} />
              </div>
              <span className="font-semibold text-lg">DMT</span>
            </div>

            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Building size={50} />
              </div>
              <span className="font-semibold text-lg">IMPS/RTGS</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Landmark size={50} />
              </div>
              <span className="font-semibold text-lg">Govt Service</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Gavel size={50} />
              </div>
              <span className="font-semibold text-lg">Legal Services</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <UserPlus size={50} />
              </div>
              <span className="font-semibold text-lg">Apply Bank BC</span>
            </div>

            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <FileText size={50} />
              </div>
              <span className="font-semibold text-lg">Account Opening</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Truck size={50} />
              </div>
              <span className="font-semibold text-lg">Courier Services</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <HeartPulse size={50} />
              </div>
              <span className="font-semibold text-lg">E-Health</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <Pill size={50} />
              </div>
              <span className="font-semibold text-lg">Medicine</span>
            </div>

            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <HandHelping size={50} />
              </div>
              <span className="font-semibold text-lg">Affliction Service</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <CalendarCheck2 size={50} />
              </div>
              <span className="font-semibold text-lg">Booking</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <DollarSign size={50} />
              </div>
              <span className="font-semibold text-lg">Consumer Finance</span>
            </div>
            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
              <div className="hover:-translate-y-2 transition-transform duration-300">
                <MonitorSmartphone size={50} />
              </div>
              <span className="font-semibold text-lg">Matm</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default B2BDashboard;