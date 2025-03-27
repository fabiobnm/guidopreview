import { useState , useEffect  } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS, GET_POSTSOrdine } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSOrdine, { client });

  // Stato per il Modal e il carosello
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState([]);

  // Animazione per il modal
  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 25 },
  });


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isModalOpen) {
        if (event.key === 'ArrowRight') {
          navigateCarousel(1); // Freccia destra -> avanti
        } else if (event.key === 'ArrowLeft') {
          navigateCarousel(-1); // Freccia sinistra -> indietro
        } else if (event.key === 'Escape') {
          closeModal(); // Esci dal modal con ESC
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, currentImageIndex, currentGallery]);


  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  console.log('datelli'+ data.ordineDeiWorks[0].works[0].nome);
  

  const openModal = (gallery, index) => {
    setCurrentGallery(gallery);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const navigateCarousel = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return currentGallery.length - 1;
      if (newIndex >= currentGallery.length) return 0;
      return newIndex;
    });
  };

  return (
    <main style={{ marginTop: '75px' }}>
      {data.ordineDeiWorks[0].works.map((progetto) => (
        <div className="projectDivWork" key={progetto.id}>
          <h1 style={{ color: 'black', fontSize: '20px', padding: '50px', paddingLeft: '0', fontFamily:'MyFontThin' }}>
            {progetto.nome}
          </h1>

          <div className="caros">
            {progetto.galleria.map((image, index) => (
              <div
                key={index}
                className="gallery-image-container"
                style={{
                  height: 'auto',
                  overflow: 'hidden',
                  margin: 'auto',
                  marginRight: '0px',
                  cursor: 'pointer',
                }}
                onClick={() => openModal(progetto.galleria, index)}
              >
                
                <Image
                  width={200}
                  height={200}
                  src={image.url}
                  alt={`${progetto.nome} galleria ${index}`}
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}

{progetto.video.map((video, index) => (
             <div
             key={index+progetto.galleria.length}
             className="gallery-image-container"
             style={{
               height: 'auto',
               overflow: 'hidden',
               margin: 'auto',
               marginRight: '0px',
               cursor: 'pointer',
             }}
             onClick={(e) => {
               if(video.fileVideo){
                window.open(video.fileVideo.url, '_blank');// Reindirizza al link
              }
             
            }}
           >
             
             <img
               src={video.thumbnail?.url}
               alt={`${progetto.nome} galleria ${index+progetto.galleria.length}`}
               style={{ width: '100%', objectFit: 'cover' }}
             />
           </div>
            ))}


          </div>
        </div>
      ))}

      <Sidebar />

      {/* Modal con animazione */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <animated.div
            style={modalAnimation}
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Impedisce la chiusura cliccando sul contenuto
          >
            <button className="close-btn" onClick={closeModal}>
              
            </button>
            <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}>
              
            </button>
            <img
              src={currentGallery[currentImageIndex]?.url}
              alt={`Carousel Image ${currentImageIndex}`}
              className="carousel-image"
            />
            <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}>
              
            </button>
          </animated.div>
        </div>
      )}
    </main>
  );
}
