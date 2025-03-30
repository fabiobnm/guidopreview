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

  const modalAnimation = useSpring({
    opacity: isModalOpen ? 1 : 0,
    transform: isModalOpen ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 25 },
  });

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
    <main style={{ marginTop: '75px' }}>
      {data.ordineDeiWorks[0].works.map((progetto) => (
        <div className="projectDivWork" key={progetto.id}>
          <h1 style={{ color: 'black', fontSize: '20px', padding: '50px', paddingLeft: '0', fontFamily: 'MyFontThin' }}>
            {progetto.nome}
          </h1>
          <div className="caros">
            {progetto.galleria.map((image, index) => (
              <div
                key={index}
                className="gallery-image-container"
                style={{ margin: 'auto',
                    marginRight: '0px'}}
                onClick={() => openModal(progetto.galleria, progetto.video, index)}
              >
                <Image width={200} height={200} src={image.url} alt={progetto.nome} style={{ width: '100%', objectFit: 'cover' }} />
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
                <Image width={200} height={200} src={video.thumbnail?.url} alt={progetto.nome} style={{ width: '100%', objectFit: 'cover' }} />
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
