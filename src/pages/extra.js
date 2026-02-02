import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSExtraWorks } from '../lib/queries';
import Sidebar from '../components/Sidebar';

export default function ExtraWorksPage() {
  const { loading, error, data } = useQuery(GET_POSTSExtraWorks, { client });

  // MODAL STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (gallery, index) => {
    setCurrentGallery(gallery);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const navigate = (dir) => {
    setCurrentIndex(prev => {
      const next = prev + dir;
      if (next < 0) return currentGallery.length - 1;
      if (next >= currentGallery.length) return 0;
      return next;
    });
  };

  // ESC + FRECCE
  useEffect(() => {
    if (!isModalOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen, currentGallery]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.extraWorks?.length) return null;

  return (
    <main style={{ marginTop: '118px', marginBottom: '200px' }}>
      {data.extraWorks.map((progetto) => (
        <div key={progetto.id} className="projectDivWork">
          {/* TITOLO */}
          <h1
            style={{
              color: 'black',
              fontSize: '16px',
              fontFamily: 'MyFont',
              marginBottom: '16px',
            }}
          >
            {progetto.nome}
          </h1>

          {/* GALLERIA SEMPRE APERTA */}
          <div
            className="caros"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr);',
              gap: '16px',
              marginBottom: '50px',
            }}
          >
            {progetto.gallery.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={progetto.nome}
                loading="lazy"
                onClick={() => openModal(progetto.gallery, index)}
                style={{
                  width: '100%',
                  height: 'auto',
                  marginBlock:'auto',
                  cursor: 'pointer',
                  display: 'block',
                }}
              />
            ))}
          </div>
        </div>
      ))}

      <Sidebar />

      {/* MODAL */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            <img
              src={currentGallery[currentIndex]?.url}
              alt=""
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'block',
              }}
            />

            {/* PREV */}
            <button
              onClick={() => navigate(-1)}
              style={navButtonStyle('left')}
            />

            {/* NEXT */}
            <button
              onClick={() => navigate(1)}
              style={navButtonStyleRight('right')}
            />

            {/* CLOSE */}
            <button
              onClick={closeModal}
              style={{
                position: 'fixed',
                top: '20px',
                right:' 20px',
                color: 'white',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

const navButtonStyle = (side) => ({
  position: 'absolute',
  top: '0%',
  [side]: '0px',
  transform: 'translateY(0%)',
  width: '50%',
  height: '100%',
  background: 'none',
  cursor: 'w-resize',
});

const navButtonStyleRight = (side) => ({
  position: 'absolute',
  top: '0%',
  [side]: '0px',
  transform: 'translateY(0%)',
  width: '50%',
  height: '100%',
  background: 'none',
  cursor: 'e-resize',
});
