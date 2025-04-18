import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSHome } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Draggable from 'react-draggable';
import { useEffect, useState } from 'react'; // ✅ aggiunto qui




export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSHome, { client });

  const [imgDragCount, setImgDragCount] = useState(0); // ✅ dentro al componente
  const [imgDragSwag, setImgDragSwag] = useState(0); // ✅ dentro al componente
  const [loadedImages, setLoadedImages] = useState({});


  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allDraggables = document.querySelectorAll('.imgDragClass');
      setImgDragCount(allDraggables.length);
      console.log('Numero di imgDragClass:', allDraggables.length);
      setImgDragSwag(allDraggables.length);

    }
  }, [data]); // ✅ Esegui il conteggio solo dopo che i dati sono caricati

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  console.log('Dati ricevuti:', data.homePages[0].cover);

  const handleClick = (event) => {
    setImgDragCount(prev => prev + 1); // ✅ aggiorna correttamente lo stato

    console.log('qui'+imgDragCount);
    const img = event.target;
    img.style.zIndex = imgDragCount ; // Incrementa lo zIndex direttamente
  };

  return (
    <main style={{ marginTop: '0px' }}>
      <div className="boxImageHome">
        {data.homePages[0].cover.map((cover, index) => (
         <Draggable>
          <div onClick={handleClick}
              style={{
              position: 'fixed',
              marginTop: `${(index) *30}px`,
              left: `${(index +1) * 50}px`,
              zIndex:(imgDragSwag- index), // Usa l'indice iniziale
              transition: 'z-index 0.2s ease-in-out',
              cursor: 'pointer',
            }}>
         <img
            onLoad={() => handleImageLoad(cover.id)}
            className="imageHome"
            key={cover.id}
            src={cover.url}
            style={{
              opacity: loadedImages[cover.id] ? 1 : 0,
                        transition: 'opacity 0.2s',
             
            }}
            
          />
          </div>
          </Draggable>
        ))}

{data.homePages[0].cover.map((cover, index) => (
         <Draggable>
          <div onClick={handleClick}
              className='imgDragClass'
              style={{
              position: 'fixed',
              marginTop: `${(index) *70}px`,
              left: `${(index +1) * 15}px`,
              zIndex:(10- index), // Usa l'indice iniziale
              transition: 'z-index 0.2s ease-in-out',
              cursor: 'pointer',
            }}>
         <img
            onLoad={() => handleImageLoad(cover.id)}
            className="imageHomeMobile"
            key={cover.id}
            src={cover.url}
            style={{
              opacity: loadedImages[cover.id] ? 1 : 0,
                        transition: 'opacity 0.2s',
             
            }}
            
          />
          </div>
          </Draggable>
        ))}
      </div>

      <Sidebar />
    </main>
  );
}
