import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.removeItem("senti.user.name");
      localStorage.removeItem("senti.user.dob");
    } catch {}
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">Logging out...</div>
  );
}
