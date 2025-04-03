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
          <h1   onClick={() => handleClick(progetto.id)}  style={{ color: 'black', fontSize: '20px', padding: '0px', paddingLeft: '0', fontFamily: 'MyFontThin' , cursor:'pointer'}}>
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
            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn prev-btn" onClick={() => navigateCarousel(-1)}></button>
            ) : (
              <button className="nav-btn prev-btnVideo"   onClick={() => navigateCarousel(-1)}><p className='carosButt'>prev</p></button>
            )}

            
            {currentGallery[currentImageIndex]?.url ? (
              <img src={currentGallery[currentImageIndex]?.url} alt="Gallery item" className="carousel-image" />
            ) : (
              <video controls className="carousel-video">
                <source src={currentGallery[currentImageIndex]?.fileVideo?.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {currentGallery[currentImageIndex]?.url ? (
              <button className="nav-btn next-btn" onClick={() => navigateCarousel(1)}></button>
            ) : (
              <button className="nav-btn next-btnVideo"  onClick={() => navigateCarousel(1)}><p className='carosButt'>next</p></button>
            )}  

           
               {selectedCreative && data.ordineDeiWorks[0].works.find(p => p.id === selectedCreative)?.nome === 'Artchive' && (
        <h1 style={{ color: 'black', position: 'relative', bottom: 0, left: 0, zIndex: 999 }}>
           {currentImageIndex === 0 && <p >Mattia Turco</p>}
        {currentImageIndex === 1 && <p >1</p>}
        {currentImageIndex === 2 && <p>2</p>}
        {currentImageIndex === 3 && <p >3</p>}
        {currentImageIndex === 4 && <p>4</p>}  
        {currentImageIndex === 5 && <p>5</p>}  
        {currentImageIndex === 6 && <p>6</p>}  
        {currentImageIndex === 7 && <p>7</p>}  
        {currentImageIndex === 8 && <p>8</p>}  
        {currentImageIndex === 9 && <p>9</p>}  
        {currentImageIndex ===10 && <p>10</p>}  
        {currentImageIndex === 11 && <p>11</p>}  
        {currentImageIndex === 12 && <p>12</p>} 
        {currentImageIndex === 13 && <p >13</p>}
        {currentImageIndex === 14 && <p>14</p>}  
        {currentImageIndex === 15 && <p>Giacomo Spazio</p>}  
        {currentImageIndex === 16 && <p>16</p>}  
        {currentImageIndex === 17 && <p>17</p>}  
        {currentImageIndex === 18 && <p>Solomostry</p>}  
        {currentImageIndex === 19 && <p>19</p>}  
        {currentImageIndex ===20 && <p>20</p>}   
        </h1>
      )}
             
          
            
            
          </animated.div>
        </div>
      )}
    </main>
  );
}
