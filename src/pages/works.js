import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSOrdine } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSOrdine, { client });
  const [loadedImages, setLoadedImages] = useState({});
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [selectedCreative, setSelectedCreative] = useState(null);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (data?.ordineDeiWorks?.[0]?.works?.length > 0) {
      setSelectedCreative(data.ordineDeiWorks[0].works[0].id);
    }
  }, [data]);

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 25 },
  });

  const handleClick = (progetto) => {
    console.log('parte'+ progetto);
    
    
    if (selectedCreative === progetto) {
      setSelectedCreative(null);
      console.log('uguale');
      
    } else {
      console.log('diverso');
      
      setSelectedCreative(null);
      setTimeout(() => {
        setSelectedCreative(progetto);
      }, 0);
    }
  };


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
  if (error) return <p>Error: {error.message}</p>;

  const openModal = (gallery, videos, index) => {
    const fullGallery = [...gallery, ...videos];
    setCurrentGallery(fullGallery);
    setCurrentImageIndex(index);
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
    <main style={{ marginTop: '118px' , marginBottom:'200px'}}>
      {data.ordineDeiWorks[0].works.map((progetto) => (
        <div className="projectDivWork" key={progetto.id} style={{marginBottom:0}}>
          <h1   onClick={() => handleClick(progetto.id)}  style={{ color: 'black', fontSize: '16px', padding: '0px', paddingLeft: '0', fontFamily: 'MyFont' , cursor:'pointer'}}>
            {progetto.nome}
          </h1>
          <div className="caros" style={{ transition: selectedCreative === progetto.id
    ? 'max-height 0.5s, opacity 0s'  // Nessuna transizione quando si apre
    : 'max-height 0.5s, opacity 1s', // Transizione di 1s quando si chiude
     maxHeight: selectedCreative === progetto.id ? 'max-content' : '0',
     marginBlock: selectedCreative === progetto.id ? '20px 50px' : '0'}}>
            {progetto.galleria.map((image, index) => (
              <div
                key={index}
                className="gallery-image-container"
                style={{ margin: 'auto',
                    marginRight: '0px'}}
                onClick={() => openModal(progetto.galleria, progetto.video, index)}
              >
                <Image onLoad={() => handleImageLoad(image.id)}
                       width={200} height={200} src={image.url} alt={progetto.nome} 
                       style={{ width: '100%', objectFit: 'cover', cursor: 'pointer',
                       opacity: loadedImages[image.id] ? 1 : 0,
                       transition: 'opacity 0.2s', }} />
              </div>
            ))}
            {progetto.video.map((video, index) => (
              <div
                key={index + progetto.galleria.length}
                className="gallery-image-container"
                style={{ margin: 'auto',
                    marginRight: '0px'}}
                onClick={() => openModal(progetto.galleria, progetto.video, index + progetto.galleria.length)}
              >
                <Image  onLoad={() => handleImageLoad(video.id)}
                        width={200} height={200} src={video.thumbnail?.url} alt={progetto.nome} 
                        style={{ width: '100%', objectFit: 'cover', cursor: 'pointer',
                        opacity: loadedImages[video.id] ? 1 : 0,
                        transition: 'opacity 0.2s', }}  />
                        
              </div>
            ))}
          </div>
        </div>
      ))}
      <Sidebar />
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <animated.div style={modalAnimation} className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}></button>
            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}></button>
            ) : (
              <button className="nav-btn prev-btnVideo"   onClick={() => navigateCarousel(-1)}><p className='carosButt'></p></button>
            )}

            
{currentGallery[currentImageIndex]?.url ? (
  <img
    src={currentGallery[currentImageIndex]?.url}
    alt="Gallery item"
    className="carousel-image"
  />
) : currentGallery[currentImageIndex]?.fileVideo?.url ? (
  <video controls className="carousel-video">
    <source
      src={currentGallery[currentImageIndex]?.fileVideo?.url}
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>
) : (
  <iframe
    width="760"
    height="415"
    src={`${currentGallery[currentImageIndex]?.link}?autoplay=1`}
    title="YouTube video player"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
    style={{zIndex:99999}}
  ></iframe>
)}

            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}></button>
            ) : (
              <button className="nav-btn next-btnVideo"  onClick={() => navigateCarousel(1)}><p className='carosButt'></p></button>
            )}  

   
             
          
            
            
          </animated.div>

                  
          {selectedCreative && data.ordineDeiWorks[0].works.find(p => p.id === selectedCreative)?.nome === 'Artchive' && (
        <h1 style={{ color: 'black', position: 'fixed', bottom: 45, right: 45, zIndex: 999 }}>
        {currentImageIndex === 0 && <p >Mattia Turco - Milan, IT</p>}
        {currentImageIndex === 1 && <p >Pedone - Grottaglie, IT</p>}
        {currentImageIndex === 2 && <p>Marion Flament - Paris, FR</p>}
        {currentImageIndex === 3 && <p >Mosa - Paris, FR </p>}
        {currentImageIndex === 4 && <p>Nicole Banowetz - Khajuraho, IND</p>}  
        {currentImageIndex === 5 && <p>Blu - Milan, IT</p>}  
        {currentImageIndex === 6 && <p>Solomostry - Milan, IT</p>}  
        {currentImageIndex === 7 && <p>Max Coulon - Paris, FR</p>}  
        {currentImageIndex === 8 && <p>Pietro Spica - Milan, IT</p>}  
        {currentImageIndex === 9 && <p>Kaï Chun Chang - Paris, FR</p>}  
        {currentImageIndex ===10 && <p>Eemyun Kang - Milan, IT</p>}  
        {currentImageIndex === 11 && <p>Mario Picardo - Paris, FR</p>}  
        {currentImageIndex === 12 && <p>Lorenzo Senni - Milan, IT</p>} 
        {currentImageIndex === 13 && <p >Giacomo Spazio - Milan, IT</p>}
        {currentImageIndex === 14 && <p>Roberto Alfano - Modena, IT</p>}  
        {currentImageIndex === 15 && <p>Marco Grassi - Milan, IT</p>}  
        {currentImageIndex === 16 && <p>Lou Ros - Paris, FR</p>}  
        {currentImageIndex === 17 && <p>Gasius - Zushi, JP</p>}  
        {currentImageIndex === 18 && <p>Emajons - Palermo, IT</p>}  
        {currentImageIndex === 19 && <p>19</p>}  
        {currentImageIndex ===20 && <p>20</p>}   
        </h1>
      )}
        </div>
      )}
    </main>
  );
}
