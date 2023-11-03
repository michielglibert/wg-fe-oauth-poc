import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Authentication from "./Authentication";
import App from "../App";
import BrokerRoute from "./BrokerRoute";
import Public from "./pages/Public";
import Dashboard from "./pages/Dashboard";
import { isSocialLoginUrl } from "../authentication/SocialAuth";
import SocialRoute from "./SocialRoute";
import Social from "./pages/Social";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/public" element={<Public />} />

        {/* Social routes  */}
        {isSocialLoginUrl && (
          <Route path="/" element={<SocialRoute />}>
            <Route index element={<Navigate to="/public" />} />
            <Route path="/social" element={<Social />} />
          </Route>
        )}

        <Route path="/" element={<BrokerRoute />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="/app" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/social" element={<Social />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
