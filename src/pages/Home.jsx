import React from 'react';
import Logo from '../assets/logo.jpg';
import '../styles/homelogo.css';

function Home() {
  React.useEffect(() => {
    const title = document.querySelector('.platform-description h1');
    title.classList.add('typing');
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <img src={Logo} alt="CodeAcademy Logo" className="logo-home" />
        <div className="platform-description">
          <h1>CodeAcademy</h1>
        </div>
      </header>

      <section className="description-section">
        <h2>Platforma Haqida</h2>
        <p>
          CodeAcademy - bu dasturlash va algoritmlar bo'yicha bilimlarni oshirish, 
          texnik suhbatlarga tayyorlanish (Google, Yandex, Facebook, IT Park, Microsoft 
          va boshqalar) uchun maxsus yaratilgan onlayn platformadir.
        </p>
      </section>

      <section className="features-section">
        <h2>Platformaning Asosiy Imkoniyatlari</h2>
        <ul className="features-list">
          <li>1000+ dasturlash masalalari (algorithmic puzzles)</li>
          <li>Real vaqtda kod tekshirish tizimi</li>
          <li>Haftalik musobaqalar va reyting tizimi</li>
          <li>Texnik intervyularga tayyorlovchi maxsus bo'lim</li>
          <li>Top kompaniyalardan intervyu savollari</li>
          <li>Dasturchilar jamoasi bilan muloqot</li>
        </ul>
      </section>

      <section className="mission-section">
        <h2>Bizning Maqsad</h2>
        <p>
          Platformaning asosiy maqsadi - foydalanuvchilarga masalalar yechish, 
          musobaqalarda qatnashish va o'z reytinglarini oshirish orqali dasturlash 
          mahoratini oshirish imkonini berish. Biz bilan birga kelajak dasturchisiga 
          aylaning!
        </p>
      </section>
    </div>
  );
}

export default Home;