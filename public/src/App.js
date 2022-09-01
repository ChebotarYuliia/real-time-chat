import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SetAvatar from "./pages/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ThemeProvider } from "styled-components";
import { dark } from "./components/styles/Theme.styled";

export default function App() {
  const [selectedTheme, setSelectedTheme] = useState(dark);

  const handleThemeChange = async (theme) => {
    await setSelectedTheme(theme)
  };

  return (
    <ThemeProvider theme={selectedTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setAvatar" element={<SetAvatar />} />
          <Route path="/" element={<Chat handleThemeChange={handleThemeChange} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}