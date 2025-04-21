import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoanReportDetail = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [applicationId, setApplicationId] = useState("");

  useEffect(() => {
    // Get application ID from location state or localStorage
    let appId = "";

    if (location.state?.applicationId) {
      appId = location.state.applicationId;
    } else {
      appId = localStorage.getItem("applicationId") || "";
    }

    setApplicationId(appId);

    if (appId) {
      fetchReportDetails(appId);
    } else {
      setError(
        "Application ID not found. Please ensure you're properly logged in."
      );
      setLoading(false);
    }
  }, [location]);

  const fetchReportDetails = async (appId) => {
    setLoading(true);
    setError("");
  
    try {
      // Get authentication token
      const authResponse = await fetch(
        "https://uat-api.evolutosolution.com/v1/authentication",
        {
          method: "POST",
          headers: {
            source: "web",
            package: "10.0.2.215",
            outletid: "OUI202590898",
            Authorization:
              "Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o=",
          },
        }
      );
  
      if (!authResponse.ok) {
        throw new Error(
          `Authentication failed with status: ${authResponse.status}`
        );
      }
  
      const authData = await authResponse.json();
      const token = authData.token;
  
      // Use POST method directly instead of trying GET first
      const reportResponse = await fetch(
        "https://uat-api.evolutosolution.com/v1/loan/reportDetail",
        {
          method: "GET",
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ref_code: "OUI202590898",
            application_id: appId,
          }),
        }
      );
  
      if (!reportResponse.ok) {
        throw new Error(
          `API error: ${reportResponse.status} - ${reportResponse.statusText}`
        );
      }
  
      const contentType = reportResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }
  
      const reportData = await reportResponse.json();
  
      if (reportData) {
        setReportData(reportData);
      } else {
        setError("Received empty response data");
      }
    } catch (err) {
      console.error("Error fetching report details:", err);
      setError(
        `Error: ${
          err.message ||
          "Failed to connect to the server. Please try again later."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center mt-16">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading loan report details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchReportDetails(applicationId)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No loan report data found for Application ID: {applicationId}</p>
        </div>
      </div>
    );
  }

  // Render the loan report details
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Loan Report Details
      </h1>

      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold border-b pb-2 mb-4">
          Application Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Application ID</p>
            <p className="font-medium">{applicationId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reference Code</p>
            <p className="font-medium">OUI202590898</p>
          </div>
          {reportData.applicant_name && (
            <div>
              <p className="text-sm text-gray-600">Applicant Name</p>
              <p className="font-medium">{reportData.applicant_name}</p>
            </div>
          )}
          {reportData.status && (
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p
                className={`font-medium ${
                  reportData.status === "Approved"
                    ? "text-green-600"
                    : reportData.status === "Rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {reportData.status}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Loan Details */}
      {reportData.loan_details && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Loan Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.loan_details.loan_amount && (
              <div>
                <p className="text-sm text-gray-600">Loan Amount</p>
                <p className="font-medium">
                  {formatCurrency(reportData.loan_details.loan_amount)}
                </p>
              </div>
            )}
            {reportData.loan_details.tenure && (
              <div>
                <p className="text-sm text-gray-600">Tenure</p>
                <p className="font-medium">
                  {reportData.loan_details.tenure} months
                </p>
              </div>
            )}
            {reportData.loan_details.interest_rate && (
              <div>
                <p className="text-sm text-gray-600">Interest Rate</p>
                <p className="font-medium">
                  {reportData.loan_details.interest_rate}%
                </p>
              </div>
            )}
            {reportData.loan_details.emi_amount && (
              <div>
                <p className="text-sm text-gray-600">EMI Amount</p>
                <p className="font-medium">
                  {formatCurrency(reportData.loan_details.emi_amount)}
                </p>
              </div>
            )}
            {reportData.loan_details.disbursement_date && (
              <div>
                <p className="text-sm text-gray-600">Disbursement Date</p>
                <p className="font-medium">
                  {new Date(
                    reportData.loan_details.disbursement_date
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Previous Loans */}
      {reportData.previous_loans && reportData.previous_loans.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Previous Loans
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">Account No</th>
                  <th className="py-2 px-4 border-b text-left">Year</th>
                  <th className="py-2 px-4 border-b text-left">Amount</th>
                  <th className="py-2 px-4 border-b text-left">EMI</th>
                  <th className="py-2 px-4 border-b text-left">Product</th>
                  <th className="py-2 px-4 border-b text-left">Bank</th>
                </tr>
              </thead>
              <tbody>
                {reportData.previous_loans.map((loan, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                  >
                    <td className="py-2 px-4 border-b">
                      {loan.loan_account_no}
                    </td>
                    <td className="py-2 px-4 border-b">{loan.loan_year}</td>
                    <td className="py-2 px-4 border-b">
                      {formatCurrency(loan.loan_amount)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {formatCurrency(loan.emi_amount)}
                    </td>
                    <td className="py-2 px-4 border-b">{loan.product}</td>
                    <td className="py-2 px-4 border-b">{loan.bank_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Score */}
      {reportData.credit_score && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Credit Score
          </h2>
          <div className="flex items-center justify-center">
            <div
              className={`text-center p-4 rounded-full w-32 h-32 flex items-center justify-center border-4 ${
                reportData.credit_score >= 750
                  ? "border-green-500 text-green-700"
                  : reportData.credit_score >= 650
                  ? "border-yellow-500 text-yellow-700"
                  : "border-red-500 text-red-700"
              }`}
            >
              <div>
                <p className="text-3xl font-bold">{reportData.credit_score}</p>
                <p className="text-sm">
                  {reportData.credit_score >= 750
                    ? "Excellent"
                    : reportData.credit_score >= 650
                    ? "Good"
                    : "Poor"}
                </p>
              </div>
            </div>
          </div>

          {reportData.credit_remarks && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Remarks</p>
              <p>{reportData.credit_remarks}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Information */}
      {reportData.additional_info &&
        Object.keys(reportData.additional_info).length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(reportData.additional_info).map(
                ([key, value]) => (
                  <div key={key} className="py-2">
                    <p className="text-sm text-gray-600">
                      {key
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                    <p className="font-medium">{value.toString()}</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}

      {/* Documents */}
      {reportData.documents && reportData.documents.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">
            Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.documents.map((doc, index) => (
              <div key={index} className="border rounded p-3 flex items-center">
                <div className="bg-blue-100 text-blue-500 p-2 rounded mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {doc.document_type || `Document ${index + 1}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {doc.status || "Uploaded"}
                  </p>
                </div>
                {doc.download_url && (
                  <a
                    href={doc.download_url}
                    className="text-blue-500 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanReportDetail;
