import { useAuth } from "../hooks/useAuth";
// import { useNavigate } from "react-router";
import { Navigate } from "react-router";
import React from "react";

const Protected = (children) => {
  const { loading, user } = useAuth();
  // const navigate = useNavigate();

  if (loading) {
    return (
      <main>
        <h1>Loading....</h1>
      </main>
    );
  }

  if (!user) {
    // navigate("/login");
    return <Navigate to={"/login"} />;
  }

  return children;
};

export default Protected;
