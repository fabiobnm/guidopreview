import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSOrdine } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSOrdine, { client });
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentGallery, setCurrentGallery] = useState([]);
  const [selectedCreative, setSelectedCreative] = useState(null);

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
      }, 500);
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
          <h1   onClick={() => handleClick(progetto.id)}  style={{ color: 'black', fontSize: '20px', padding: '0px', paddingLeft: '0', fontFamily: 'MyFontThin' , cursor:'pointer'}}>
            {progetto.nome}
          </h1>
          <div className="caros" style={{ transition: selectedCreative === progetto.nome
    ? 'max-height 0.5s, opacity 0s'  // Nessuna transizione quando si apre
    : 'max-height 0.5s, opacity 10s', // Transizione di 1s quando si chiude
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
                <Image width={200} height={200} src={image.url} alt={progetto.nome} style={{ width: '100%', objectFit: 'cover', cursor: 'pointer' }} />
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
                <Image width={200} height={200} src={video.thumbnail?.url} alt={progetto.nome} style={{ width: '100%', objectFit: 'cover', cursor: 'pointer' }} />
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
            <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}></button>
            {currentGallery[currentImageIndex]?.url ? (
              <img src={currentGallery[currentImageIndex]?.url} alt="Gallery item" className="carousel-image" />
            ) : (
              <video controls className="carousel-video">
                <source src={currentGallery[currentImageIndex]?.fileVideo?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}></button>
          </animated.div>
        </div>
      )}
    </main>
  );
}
