// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home1 from "./pages/Home1";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import OlympiadList from "./pages/OlympiadList";
import About from "./pages/About";
import Working from "./pages/Working.jsx";
import OlympiadRegistration from "./pages/OlympiadRegistration";
import OlympiadDetail from "./pages/OlympiadDetail";
import OlympiadProblems from "./pages/OlympiadProblems";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home1 global layout sifatida ishlatiladi */}
        <Route path="/" element={<Home1 />}>
          {/* Bosh sahifa */}
          <Route index element={<div style={{ padding: '24px', color: '#000' }}>
            <Home />
            {/* <h2>Bosh Sahifa</h2>
            <p>Bu sizning dasturlash mahoratingizni oshirish uchun eng ilg‘or platforma.</p> */}
          </div>} />

          {/* Ro‘yxatdan o‘tish va kirish sahifalari */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Himoyalangan sahifalar */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Masalalar va musobaqalar sahifalari */}
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/olympiads" element={<OlympiadList />} />
          <Route path="/about" element={<About />} />
          <Route path="/working" element={<Working />} />
          <Route path="/olympiads/:olympiad_id" element={<OlympiadDetail />} />
          <Route path="/olympiads/:olympiad_id/problems" element={<OlympiadProblems />} />
          <Route path="/olympiads-register/:olympiad_id" element={<OlympiadRegistration />} />

          {/* 404 sahifasi */}
          <Route path="*" element={<div style={{ padding: '24px', color: '#fff' }}>
            <h2>404 - Sahifa Topilmadi</h2>
            <p>Kechirasiz, bu sahifa mavjud emas.</p>
          </div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;