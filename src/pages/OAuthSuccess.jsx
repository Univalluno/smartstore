import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const user = params.get("user");
    const token = params.get("token");

    if (user && token) {
      login(JSON.parse(decodeURIComponent(user)), token);
      navigate("/");
    } else {
      navigate("/auth");
    }
  }, [login, navigate]);

  return <p className="p-6">Iniciando sesión...</p>;
};

export default OAuthSuccess;
