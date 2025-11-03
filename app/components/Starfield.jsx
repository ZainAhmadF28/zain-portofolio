// src/components/Starfield.jsx
import React from 'react';

/**
 * Komponen untuk menghasilkan efek bintang jatuh (meteor) secara acak.
 * @param {object} props - Properti komponen.
 * @param {number} [props.shootingStarCount=5] - Jumlah bintang jatuh yang akan ditampilkan.
 * @returns {JSX.Element}
 */
const Starfield = ({ shootingStarCount = 5 }) => {
  // Membuat array elemen bintang jatuh berdasarkan jumlah yang ditentukan
  const shootingStars = Array.from({ length: shootingStarCount }).map((_, i) => (
    <div
      key={`shooting-star-${i}`}
      className="shooting-star"
      style={{
        // Posisi awal acak di layar
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 100}%`,
        // Durasi animasi acak antara 1-3 detik
        animationDuration: `${Math.random() * 2 + 1}s`,
        // Penundaan animasi acak antara 1-6 detik
        animationDelay: `${Math.random() * 5 + 1}s`,
      }}
    />
  ));

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      {shootingStars}
    </div>
  );
};

export default Starfield;
