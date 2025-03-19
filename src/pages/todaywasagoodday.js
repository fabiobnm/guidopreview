import { useState } from 'react';
import Modal from 'react-modal'; // Importa React Modal
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSToday } from '../lib/queries';
import Sidebartest from '../components/Sidebartest';

Modal.setAppElement('#__next'); // Indica il nodo principale della tua app

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSToday, { client });

  const [isModalOpen, setIsModalOpen] = useState(false); // Stato per il Modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Stato per l'immagine corrente
  const [images, setImages] = useState([]); // Stato per l'array di immagini

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.progetti) {
    return <p>Nessun progetto trovato</p>;
  }

  // Assicurati che `data.progetti` sia sempre un array
  const progetti = Array.isArray(data.progetti) ? data.progetti : [data.progetti];

  // Funzione per aprire il Modal con le immagini
  const openModal = (index, galleria) => {
    setImages(galleria);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  // Funzione per chiudere il Modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Funzioni per navigare nel carosello
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <main style={{ marginTop: '125px' }}>
      {progetti.map((progetto) => (
        <div
          style={{
            height: 'auto',
            margin: '0px',
            paddingLeft: '45px',
            paddingRight: '45px',
          }}
          key={progetto.id}
        >
          <h1 style={{ color: 'black', fontSize: '28px' }}>{progetto.nome}</h1>

          <div className="caros">
            {progetto.galleria.map((image, index) => (
              <div
                key={index}
                className="gallery-image-container"
                style={{
                  width: '250px',
                  maxHeight: '350px',
                  overflow: 'hidden',
                  margin: 'auto',
                  marginRight: '15px',
                }}
                onClick={() => openModal(index, progetto.galleria)} // Apre il Modal al clic
              >
                <img
                  src={image.url}
                  alt={`${progetto.nome} galleria ${index}`}
                  style={{ width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal per il carosello */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,
            border: 'none',
            background: 'transparent',
          },
        }}
      >
        {images.length > 0 && (
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>

            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              &#8249;
            </button>

            <img
              src={images[currentImageIndex].url}
              alt={`Immagine ${currentImageIndex}`}
              style={{ width: '80vw', maxHeight: '80vh', objectFit: 'contain' }}
            />

            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
              }}
            >
              &#8250;
            </button>
          </div>
        )}
      </Modal>

      <Sidebartest />
    </main>
  );
}
