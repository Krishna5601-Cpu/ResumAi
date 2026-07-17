import { createContext, useState } from "react";

export const interviewContext = createContext();

export const interviewProvider = ({ children }) => {

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);


  return (
    <interviewContext.Provider value={loading, setLoading, report, setLoading, report, setReports}>
      {children}
    </interviewContext.Provider>
  )



}