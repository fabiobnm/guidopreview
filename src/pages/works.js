import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSOrdine } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

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
    if (selectedCreative === progetto) {
      setSelectedCreative(null);
    } else {
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

  useEffect(() => {
  const html = document.documentElement;
  if (isModalOpen) {
    html.style.overflowY = 'hidden';
  } else {
    html.style.overflowY = 'auto';
  }

  return () => {
    html.style.overflowY = 'auto'; // cleanup quando il componente si smonta
  };
}, [isModalOpen]);

  // SWIPE HANDLERS
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigateCarousel(1),
    onSwipedRight: () => navigateCarousel(-1),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false, // o true se vuoi anche desktop
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main style={{ marginTop: '118px', marginBottom: '200px' }}>
      {data.ordineDeiWorks[0].works.map((progetto) => (
        <div className="projectDivWork" key={progetto.id} style={{ marginBottom: 0 }}>
          <h1
            onClick={() => handleClick(progetto.id)}
            style={{
              color: 'black',
              fontSize: '16px',
              padding: '0px',
              paddingLeft: '0',
              fontFamily: 'MyFont',
              cursor: 'pointer',
            }}
          >
            {progetto.nome}
          </h1>
          <div
            className="caros"
            style={{
              transition:
                selectedCreative === progetto.id
                  ? 'max-height 0.5s, opacity 0s'
                  : 'max-height 0.5s, opacity 1s',
              maxHeight: selectedCreative === progetto.id ? 'max-content' : '0',
              marginBlock: selectedCreative === progetto.id ? '20px 50px' : '0',
            }}
          >
            {progetto.galleria.map((image, index) => (
              <div
                key={index}
                className="gallery-image-container"
                style={{ margin: 'auto', marginRight: '0px' }}
                onClick={() => openModal(progetto.galleria, progetto.video, index)}
              >
                <Image
                  onLoad={() => handleImageLoad(image.id)}
                  width={200}
                  height={200}
                  src={image.url}
                  alt={progetto.nome}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: loadedImages[image.id] ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                />
              </div>
            ))}
            {progetto.video.map((video, index) => (
              <div
                key={index + progetto.galleria.length}
                className="gallery-image-container"
                style={{ margin: 'auto', marginRight: '0px' }}
                onClick={() => openModal(progetto.galleria, progetto.video, index + progetto.galleria.length)}
              >
                <img
                  onLoad={() => handleImageLoad(video.id)}
                  width={200}
                  height={200}
                  src={video.thumbnail?.url}
                  alt={progetto.nome}
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: loadedImages[video.id] ? 1 : 0,
                    transition: 'opacity 0.2s',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Sidebar />

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <animated.div
            {...swipeHandlers}
            style={modalAnimation}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}></button>

            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}></button>
            ) : (
              <button className="nav-btn prev-btnVideo" onClick={() => navigateCarousel(-1)}>
                <p className="carosButt"></p>
              </button>
            )}

            {currentGallery[currentImageIndex]?.url ? (
              <img
                src={currentGallery[currentImageIndex]?.url}
                alt="Gallery item"
                className="carousel-image"
              />
            ) : currentGallery[currentImageIndex]?.fileVideo?.url ? (
              <video controls className="carousel-video">
                <source src={currentGallery[currentImageIndex]?.fileVideo?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                width="760"
                height="415"
                src={`${currentGallery[currentImageIndex]?.link}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ zIndex: 99999 }}
              ></iframe>
            )}

            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}></button>
            ) : (
              <button className="nav-btn next-btnVideo" onClick={() => navigateCarousel(1)}>
                <p className="carosButt"></p>
              </button>
            )}
          </animated.div>

          {selectedCreative &&
            data.ordineDeiWorks[0].works.find((p) => p.id === selectedCreative)?.nome === 'Artchive' && (
              <h1 style={{ color: 'black', position: 'fixed', bottom: 45, right: 45, zIndex: 999 }}>
                {
                  [
                    'Mattia Turco - Milan, IT',
                    'Pedone - Grottaglie, IT',
                    'Marion Flament - Paris, FR',
                    'Mosa - Paris, FR',
                    'Nicole Banowetz - Khajuraho, IND',
                    'Blu - Milan, IT',
                    'Solomostry - Milan, IT',
                    'Max Coulon - Paris, FR',
                    'Pietro Spica - Milan, IT',
                    'Kaï Chun Chang - Paris, FR',
                    'Eemyun Kang - Milan, IT',
                    'Mario Picardo - Paris, FR',
                    'Lorenzo Senni - Milan, IT',
                    'Giacomo Spazio - Milan, IT',
                    'Roberto Alfano - Modena, IT',
                    'Marco Grassi - Milan, IT',
                    'Lou Ros - Paris, FR',
                    'Gasius - Zushi, JP',
                    'Emajons - Palermo, IT',
                    '19',
                    '20',
                  ][currentImageIndex]
                }
              </h1>
            )}
        </div>
      )}
    </main>
  );
}
