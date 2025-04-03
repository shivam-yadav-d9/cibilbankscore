import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-12 gap-5 flex-col-reverse md:flex-row text-center md:text-left mt-16">
        <div className="left">
          <h1 className="text-4xl text-crimson md:text-5xl">
            The Modern banking <span className="font-bold text-blue-500">solutions</span> <br />
            For your business in one app
          </h1>
          <p className="text-gray-600 text-base md:text-lg my-4">
            At DBNpe, we believe everyone deserves financial freedom, whether you’re looking to check your CIBIL score or secure a loan—our platform makes it simple to understand your credit health and achieve your goals.
          </p>
          <button className="text-white bg-crimson py-2 px-4 text-base md:text-lg rounded hover:bg-red-700 transition">
            Get Start
          </button>
        </div>
        <div className="right mt-5 md:mt-0">
          <img src="/auth.png" alt="Hero Image" className="max-w-full" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-indigo-900/20 backdrop-blur-sm xl:w-[1200px] mx-auto mb-7">
        <div className="p-8 xl:p-10">
          <h2 className="text-[30px] font-semibold text-black mb-12 flex items-center justify-center text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-3 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Our Services
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
            <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <Link to="/userinput"> <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Check Credit Score
              </h3>
              </Link>
            </button>

            <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2a6 6 0 016 6c0 3-6 10-6 10S6 11 6 8a6 6 0 016-6zm1 9h-2v2h2v-2zm0-4h-2v3h2V7z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
                Apply For Loan
              </h3>
            </button>

            <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 2h6a2 2 0 012 2v16a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2zm0 4h6m-6 4h6m-6 4h4"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Bill Payment
  </h3>
</button>

<button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v2m0 16v2m-6-6h12m-7-7H5l2.5 7h9L19 8h-4.5M12 3L8.5 10h7L12 3z"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Legal Advice
  </h3>
</button>

<button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c1.38 0 2.5-1.12 2.5-2.5S13.38 3 12 3 9.5 4.12 9.5 5.5 10.62 8 12 8zm0 0v4m0 4v5m0-5h5m-5 0H7m0 0l3-3m-3 3l3 3"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Split EMI
  </h3>
</button>
<button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5l18 18M15 7h.01M6.6 5.4l1.4 1.4M17 17l4 4m-9.4-4.4l1.4 1.4m-9.4 0l-1.4 1.4M15 17h.01M6.6 18.6l1.4-1.4m0-10l-1.4-1.4M18.6 6.6l-1.4 1.4M12 12l-3 3m0-6l3 3m6 6l-3-3m0 6l3-3"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Stop Recovery Call
  </h3>
</button>


<button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center"> 
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2a10 10 0 00-10 10h1a9 9 0 0118 0h1a10 10 0 00-10-10zm-4 10a4 4 0 118 0m-8 0a4 4 0 118 0m-4 0v6m0 0h-2m2 0h2"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Expect Connect
  </h3>
</button>
<button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
  <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 2C7.58 2 4 4.58 4 7.95V12c0 3.64 2.56 6.69 6.24 7.78a1 1 0 00.52 0C17.44 18.69 20 15.64 20 12V7.95C20 4.58 16.42 2 12 2zM10 12.5l2 2 4-4"
      />
    </svg>
  </div>
  <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
    Insurance
  </h3>
</button>

            {/* <button className="group bg-white p-4 md:p-6 xl:p-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 backdrop-blur-sm border border-slate-700/30 hover:-translate-y-1 flex flex-col items-center justify-center text-center">
              <div className="bg-indigo-900/30 w-8 h-8 md:w-12 md:h-12 xl:w-14 xl:h-14 rounded-lg flex items-center justify-center mb-2 md:mb-4 xl:mb-6 text-indigo-400 group-hover:bg-indigo-600/40 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-sm md:text-base xl:text-lg text-black mb-1 md:mb-2 xl:mb-3 group-hover:text-indigo-400 transition-colors duration-300">
              IMPS (Immediate Payment Service)

              </h3>
            </button> */}

          </div>
        </div>
      </div>


    </>
  );
};

export default Dashboard;


