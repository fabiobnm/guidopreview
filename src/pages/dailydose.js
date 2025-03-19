import { useState } from 'react';
import Modal from 'react-modal'; // Importa React Modal
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSDailyDose } from '../lib/queries';
import Sidebartest from '../components/Sidebartest';

Modal.setAppElement('#__next'); // Indica il nodo principale della tua app

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSDailyDose, { client });

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




  return (
    <main style={{ marginTop: '10px' }}>
      <h1 style={{color:'black',padding:'20px', fontSize:'40px'}}>GUIDO BORDO DAILY DOSE 2025</h1>
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

   
    </main>
  );
}


const styles = {
  titoloG: {
    color:'red'
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
};