import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [calculations, setCalculations] = useState([0]);
  const [formData, setFormData] = useState({
    0: {
      title: "Calculation 1",
      principal: "",
      startDate: "",
      endDate: "",
      tableData: [{ interestRate: "", fromDate: "", toDate: "" }],
      summary: {
        total: 0,
        totalInterest: 0,
        latexFormulaVariables: "",
        latexFormulaValues: "",
      },
    },
  });
  const clearAll = (tabIndex) => {
    setFormData((prev) => ({
      ...prev,
      [tabIndex]: {
        ...prev[tabIndex],
        principal: "",
        startDate: "",
        endDate: "",
        tableData: [{ interestRate: "", fromDate: "", toDate: "" }],
        summary: {
          total: 0,
          totalInterest: 0,
          latexFormulaVariables: "",
          latexFormulaValues: "",
        },
      },
    }));
  };
  const clearAllTabs = () => {
    setFormData({
      0: {
        title: "Calculation 1",
        principal: "",
        startDate: "",
        endDate: "",
        tableData: [{ interestRate: "", fromDate: "", toDate: "" }],
        summary: {
          total: 0,
          totalInterest: 0,
          latexFormulaVariables: "",
          latexFormulaValues: "",
        },
      },
    });
  };

  return (
    <AppContext.Provider
      value={{
        calculations,
        setCalculations,
        formData,
        setFormData,
        clearAll,
        clearAllTabs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
