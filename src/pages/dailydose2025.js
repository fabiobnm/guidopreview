import Link from 'next/link';
import { useState } from 'react';
import Modal from 'react-modal'; // Importa React Modal
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSDailyDose2025DEF } from '../lib/queries';

Modal.setAppElement('#__next'); // Indica il nodo principale della tua app

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSDailyDose2025DEF, { client });

  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // Indice dell'immagine selezionata
  const [currentGallery, setCurrentGallery] = useState([]); // Gallery corrente
  const [isModalOpen, setIsModalOpen] = useState(false); // Stato per la visibilità della modale

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.dailyDose2025S) {
    return <p>Nessun progetto trovato</p>;
  }

  const progetti = Array.isArray(data.dailyDose2025S[0]) ? data.dailyDose2025S[0] : [data.dailyDose2025S[0]];

  // Funzione per aprire la modale e impostare la gallery corrente
  const openModal = (gallery, index) => {
    setCurrentGallery(gallery);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setCurrentGallery([]);
    setIsModalOpen(false);
  };

  // Funzione per andare avanti nella gallery
  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex + 1) % currentGallery.length);
  };

  // Funzione per tornare indietro nella gallery
  const prevImage = () => {
    setSelectedImageIndex((prevIndex) =>
      (prevIndex - 1 + currentGallery.length) % currentGallery.length
    );
  };

  return (
    <main style={{ marginTop: '0px', background:'orange' }}>
      <img className='dailyLogo' src='/dailyd.jpeg' alt="Daily Dose Logo" />
      <div style={{ display: 'block' }}>
        <h1 className='titoloDaily'> <Link href="/">Guido Borso</Link> <br></br>DAILY DOSE 2025</h1>
        <h2 className='sottoTitoloDaily'>One year of everyday life pictures</h2>
      </div>
      {progetti.map((progetto) => (
        <div className='dailyPost' key={progetto.id}>
          <div className='dailydoseDiv'>
            {progetto.gallery.map((gigio, index) => (
              <img
                key={index}
                src={gigio.url}
                alt={`${progetto.nome} galleria ${index}`}
                className='dailyPostImage'
                onClick={() => openModal(progetto.gallery, index)} // Passa la gallery e l'indice
              />
            ))}
          </div>
        </div>
      ))}

      {/* Modale per l'immagine */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgb(237 237 237 / 96%)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'transparent',
            border: 'none',
            padding: 0,
          },
        }}
      >
        {currentGallery.length > 0 && selectedImageIndex !== null && (
          <>
            <img
              src={currentGallery[selectedImageIndex].url}
              alt={`Immagine ${selectedImageIndex + 1}`}
              style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }}
            />
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                zIndex:'99'
              }}
            >
              x
            </button>
            <button
              onClick={prevImage}
              style={{
                position: 'absolute',
                top: '0%',
                left: '0px',
                height:'100%',
                width:'50%', 
                background: '#ffffff00',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                cursor: 'w-resize',
              }}
            >
              
            </button>
            <button
              onClick={nextImage}
              style={{
                position: 'absolute',
                top: '0%',
                height:'100%',
                width:'50%',
                right: '0px',
                background: '#ffffff00',
                border: 'none',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                cursor: 'e-resize',
              }}
            >
              
            </button>
          </>
        )}
      </Modal>
    </main>
  );
}
