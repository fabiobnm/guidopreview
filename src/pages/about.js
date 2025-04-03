import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSAbout } from '../lib/queries';
import Sidebar from '../components/Sidebar'; 
import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function Home() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState([]);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX + 10, y: e.clientY - 200 }); // Sposta leggermente l'immagine sopra al cursore
  };

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 25 },
  });

  const { loading, error, data } = useQuery(GET_POSTSAbout, { client });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isModalOpen) {
        if (event.key === 'ArrowRight') navigateCarousel(1);
        else if (event.key === 'ArrowLeft') navigateCarousel(-1);
        else if (event.key === 'Escape') closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }


  const openModal = (gallery) => {
    if (!gallery || gallery.length === 0) return;
    const images = gallery.map((img) => img.url); // Estrai gli URL
    setCurrentGallery(images);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const navigateCarousel = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      if (newIndex < 0) return currentGallery.length - 1;
      if (newIndex >= currentGallery.length) return 0;
      return newIndex;
    });
  };

  return (
    <main>
      <div className="divCommissions">
        <img className="imgAbout" src={data.abouts[0].immagine.url} />
        <p className="pAbout">
          <div className="aboutBio" dangerouslySetInnerHTML={{ __html: data.abouts[0].biography.html }}></div>
        </p>
      </div>

      <div className="aboutText" dangerouslySetInnerHTML={{ __html: data.abouts[0].education.html }}></div>


      <div className='divBookZine'>       
        <p style={{color:'black',fontWeight: 'bolder'}}>Books:</p>
        {data.abouts[0].books.map((book) => (
          <p
            key={book.id}
            onMouseEnter={() => setHoveredImage(book.img?.url)}
            onMouseLeave={() => setHoveredImage(null)}
            onMouseMove={handleMouseMove}
            onClick={() => openModal(book.gallery)}
            style={{ cursor: 'pointer', margin: '0px' , marginTop:'1px', color:'black', width: 'fit-content'}} // Aggiunge margine tra i <p>
          >
            {book.text}
          </p>
        ))}

        {hoveredImage && (
          <img
            src={hoveredImage}
            style={{
              position: 'fixed',
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: '300px',
              padding: '5px',
              pointerEvents: 'none', // Evita che l'immagine interferisca con il mouse
           
            }}
          />
        )}
      </div>



      <div className='divBookZine'>       
        <p style={{color:'black',fontWeight: 'bolder'}}>Fanzines:</p>
        {data.abouts[0].fanzine.map((zine) => (
          <p
            key={zine.id}
            onMouseEnter={() => setHoveredImage(zine.img?.url)}
            onMouseLeave={() => setHoveredImage(null)}
            onMouseMove={handleMouseMove}
            onClick={() => openModal(zine.gallery)}
            style={{ cursor: 'pointer', margin: '0px' , marginTop:'1px', color:'black', width: 'fit-content'}} // Aggiunge margine tra i <p>
          >
            {zine.text}
          </p>
        ))}

        {hoveredImage && (
          <img
            src={hoveredImage}
            style={{
              position: 'fixed',
              top: `${position.y}px`,
              left: `${position.x}px`,
              width: '300px',
              padding: '5px',
              pointerEvents: 'none', // Evita che l'immagine interferisca con il mouse
           
            }}
          />
        )}
      </div>
      <div className="aboutTextDate" dangerouslySetInnerHTML={{ __html: data.abouts[0].cv.html }}></div>

      {isModalOpen && (
      <div className="modal-overlay" onClick={closeModal}>
      <animated.div style={modalAnimation} className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}></button>
        <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}></button>
        {currentGallery.length > 0 && (
          <img src={currentGallery[currentImageIndex]} alt={'alt'+currentImageIndex} className="carousel-image" />
        )}
        <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}></button>
      </animated.div>
      </div>
      )}

      <Sidebar />
    </main>
  );
}
