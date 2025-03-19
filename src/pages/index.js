import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSHome } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Draggable from 'react-draggable';


export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSHome, { client });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  console.log('Dati ricevuti:', data.homePages[0].cover);

  const handleClick = (event) => {
    const img = event.target;
    const currentZIndex = parseInt(img.style.zIndex, 10) || 0;
    img.style.zIndex = currentZIndex + 4; // Incrementa lo zIndex direttamente
  };

  return (
    <main style={{ marginTop: '0px' }}>
      <div className="boxImageHome">
        {data.homePages[0].cover.map((cover, index) => (
         <Draggable>
          <div onClick={handleClick}
              style={{
              position: 'fixed',
              marginTop: `${(index) *60}px`,
              right: `${(index +1) * 60}px`,
              zIndex: index, // Usa l'indice iniziale
              transition: 'z-index 0.2s ease-in-out',
              cursor: 'pointer',
            }}>
         <img
            className="imageHome"
            key={cover.id}
            src={cover.url}
           
            
          />
          </div>
          </Draggable>
        ))}
      </div>

      <img style={{ zIndex: 99, width: '110px', position: 'fixed', bottom: 0, left: '-50px' }} src='TARTA.png' />

      <Sidebar />
    </main>
  );
}
