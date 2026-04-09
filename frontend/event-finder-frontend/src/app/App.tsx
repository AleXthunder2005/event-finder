import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { EventDetailPage } from "./pages/event-detail";
import { OrganizerPage } from "./pages/organizer";
import { ProfilePage } from "./pages/profile";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { EmailConfirmation } from "./pages/emailConfirmation";
import { NotFoundPage } from "./pages/not-found";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateHome = () => {
  const { isAuthenticated } = useAuth();

  // return isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />;
  return <HomePage/>;
};

export default function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/" element={<PrivateHome />} />
            {/* <Route path="/events/:id" element={<EventDetailPage />} /> */}
            {/* <Route path="/organizers/:id" element={<OrganizerPage />} /> */}
             <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}