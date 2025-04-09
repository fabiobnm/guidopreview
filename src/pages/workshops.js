import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSEducNew } from '../lib/queries';
import Sidebar from '../components/Sidebar'; 
import { useState } from 'react';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSEducNew, { client });

  if (loading) return <p>Loading...</p>;
  if (error) {
    alert('err');
    console.error('Errore nella query:', error.message);
    console.error('Dettagli dell\'errore:', error.graphQLErrors);
    console.error('Dettagli della risposta:', error.networkError);
    return <p>Error: {error.message}</p>;
  }

  console.log('Dati ricevuti:', data.workshops[0]);

  return (
    <main>
      <div className='textWorkshops' dangerouslySetInnerHTML={{ __html: data.workshops[0].text.html }}></div>
      
      <div className="educational">
        {data.workshops[0].educational.map((progetto, index) => (
          <ImageHover key={index} progetto={progetto} />
        ))}
      </div>
      
      <Sidebar />
    </main>
  );
}

// Componente separato per la gestione dell'hover
const ImageHover = ({ progetto }) => {
  const [imageSrc, setImageSrc] = useState(progetto.copertina?.url);

  return (
    <div>
      <img className='imgWorkshop'
        src={imageSrc} 
        alt={progetto.nome}
        onMouseEnter={() => setImageSrc(progetto.retro.url)}  // Cambia immagine all'hover
        onMouseLeave={() => setImageSrc(progetto.copertina.url)} // Ritorna all'immagine originale
      />
    </div>
  );
};
