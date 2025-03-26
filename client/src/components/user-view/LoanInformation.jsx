import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoanInformation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hasTakenLoan: "no",
    numberOfLoans: 0,
    hasBouncedEMI: "no",
    bouncedEMICount: 0,
    isNPAOrDefaulter: "no",
    loans: [
      { loanAmount: "", emi: "", bouncedEmi: 0 },
      { loanAmount: "", emi: "", bouncedEmi: 0 },
    ]
  });
  const [creditScore, setCreditScore] = useState(0);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user input data from previous form
    const userInput = JSON.parse(localStorage.getItem("userInput"));
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!userInput) {
      navigate("/");
      return;
    }
    
    setUserData({ ...user, ...userInput });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLoanChange = (index, field, value) => {
    const updatedLoans = [...formData.loans];
    updatedLoans[index] = {
      ...updatedLoans[index],
      [field]: value
    };

    setFormData(prevData => ({
      ...prevData,
      loans: updatedLoans
    }));
  };

  const calculateCreditScore = () => {
    // Calculate credit score based on the rules
    if (formData.hasTakenLoan === "no") {
      return 0;
    }

    if (formData.isNPAOrDefaulter === "yes") {
      // Random score between 500-600 if NPA or defaulter
      return Math.floor(Math.random() * (600 - 500 + 1)) + 500;
    }

    if (formData.hasBouncedEMI === "yes" && formData.bouncedEMICount >= 3) {
      // Random score between 600-650 if EMI has bounced 3 or more times
      return Math.floor(Math.random() * (650 - 600 + 1)) + 600;
    }

    // Calculate based on loan history for good payers
    // Good history starts with better score
    const baseScore = 700;
    
    // Add points for having multiple loans paid regularly
    const loanBonus = formData.numberOfLoans > 0 ? Math.min(formData.numberOfLoans * 20, 80) : 0;
    
    // Subtract points for any bounced EMIs (if less than 3)
    const penaltyPoints = formData.hasBouncedEMI === "yes" ? formData.bouncedEMICount * 15 : 0;
    
    // Calculate final score (capped at 850)
    return Math.min(Math.max(baseScore + loanBonus - penaltyPoints, 650), 850);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate credit score
    const finalCreditScore = calculateCreditScore();
    setCreditScore(finalCreditScore);
    
    // Save data and credit score to localStorage
    const dashboardData = {
      ...userData,
      creditScore: finalCreditScore,
      loanInfo: formData
    };
    
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    
    // Navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white text-center mb-8 drop-shadow-md">
          Loan and Credit Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-white text-sm font-medium mb-2 block">
                Have you taken a loan before?
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasTakenLoan"
                    value="yes"
                    checked={formData.hasTakenLoan === "yes"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasTakenLoan"
                    value="no"
                    checked={formData.hasTakenLoan === "no"}
                    onChange={handleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2 text-white">No</span>
                </label>
              </div>
            </div>

            {formData.hasTakenLoan === "yes" && (
              <>
                <div className="relative">
                  <label className="text-white text-sm font-medium mb-1 block">
                    How many loans have you taken?
                  </label>
                  <input
                    type="number"
                    name="numberOfLoans"
                    min="0"
                    value={formData.numberOfLoans}
                    onChange={handleChange}
                    className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <label className="text-white text-sm font-medium mb-2 block">
                    Has your EMI ever bounced?
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasBouncedEMI"
                        value="yes"
                        checked={formData.hasBouncedEMI === "yes"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-white">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="hasBouncedEMI"
                        value="no"
                        checked={formData.hasBouncedEMI === "no"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-white">No</span>
                    </label>
                  </div>
                </div>

                {formData.hasBouncedEMI === "yes" && (
                  <div className="relative">
                    <label className="text-white text-sm font-medium mb-1 block">
                      How many times has your EMI bounced?
                    </label>
                    <input
                      type="number"
                      name="bouncedEMICount"
                      min="0"
                      value={formData.bouncedEMICount}
                      onChange={handleChange}
                      className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <label className="text-white text-sm font-medium mb-2 block">
                    Are you an NPA or defaulter?
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isNPAOrDefaulter"
                        value="yes"
                        checked={formData.isNPAOrDefaulter === "yes"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-white">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="isNPAOrDefaulter"
                        value="no"
                        checked={formData.isNPAOrDefaulter === "no"}
                        onChange={handleChange}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-white">No</span>
                    </label>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white text-lg font-medium mb-4">
                    Additional Loan Information
                  </h3>
                  
                  {formData.numberOfLoans > 0 && formData.loans.slice(0, Math.min(formData.numberOfLoans, 2)).map((loan, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/10 rounded-xl">
                      <h4 className="text-white font-medium mb-3">
                        Loan {index + 1}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-white text-sm font-medium mb-1 block">
                            Loan Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={loan.loanAmount}
                            onChange={(e) => handleLoanChange(index, 'loanAmount', e.target.value)}
                            className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-1 block">
                            EMI (₹)
                          </label>
                          <input
                            type="number"
                            value={loan.emi}
                            onChange={(e) => handleLoanChange(index, 'emi', e.target.value)}
                            className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-white text-sm font-medium mb-1 block">
                            Bounced EMI (Count)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={loan.bouncedEmi}
                            onChange={(e) => handleLoanChange(index, 'bouncedEmi', e.target.value)}
                            className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-white/10 p-4 rounded-xl mt-6">
            <h3 className="text-white text-lg font-medium mb-2">Credit Score Information</h3>
            <ul className="list-disc pl-5 text-white space-y-1">
              <li>If your EMI has bounced three times or three EMIs are delayed, your credit score will be between 600-650.</li>
              <li>If you are an NPA or defaulter, your credit score will be between 500-600.</li>
              <li>If you have never taken a loan, your credit score will be 0.</li>
              <li>Regular loan payments with no defaults will result in a higher credit score.</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-bold p-4 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 mt-8 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
          >
            Generate Credit Score
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoanInformation;