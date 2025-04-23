import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSHome } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Draggable from 'react-draggable';
import { useEffect, useState } from 'react';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSHome, { client });

  const [imgDragCount, setImgDragCount] = useState(0);
  const [imgDragSwag, setImgDragSwag] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [motionEnabled, setMotionEnabled] = useState(false);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allDraggables = document.querySelectorAll('.imgDragClass');
      setImgDragCount(allDraggables.length);
      setImgDragSwag(allDraggables.length);
    }
  }, [data]);

  const handleClick = (event) => {
    setImgDragCount(prev => prev + 1);
    const img = event.target;
    img.style.zIndex = imgDragCount;
  };

  // 👉 Movimento accelerometro
  useEffect(() => {
    if (motionEnabled && typeof window !== 'undefined' && window.DeviceMotionEvent) {
      const handleMotion = (event) => {
        const { x, y } = event.accelerationIncludingGravity || {};
        const sensitivity = 2;

        const imgs = document.querySelectorAll('.imgDragClass');
        imgs.forEach((img) => {
          const currentLeft = parseFloat(img.style.left) || 0;
          const currentTop = parseFloat(img.style.top) || 0;

          img.style.left = `${currentLeft + (x * sensitivity)}px`;
          img.style.top = `${currentTop + (y * sensitivity)}px`;
        });
      };

      window.addEventListener('devicemotion', handleMotion, true);
      return () => window.removeEventListener('devicemotion', handleMotion);
    }
  }, [motionEnabled]);

  // 👉 Attiva permesso su iOS
  const enableMotion = async () => {
    if (
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceMotionEvent.requestPermission();
        if (response === 'granted') setMotionEnabled(true);
      } catch (error) {
        console.error('Permesso negato:', error);
      }
    } else {
      setMotionEnabled(true); // Android o browser che non richiede permesso
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  return (
    <main style={{ marginTop: '0px' }}>
      <button
        onClick={enableMotion}
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 9999,
          padding: '10px 20px',
          background: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
        }}
      >
        📲 Attiva movimento dispositivo
      </button>

      <div className="boxImageHome">
        {data.homePages[0].cover.map((cover, index) => (
          <Draggable key={`desktop-${cover.id}`}>
            <div
              onClick={handleClick}
              style={{
                position: 'fixed',
                marginTop: `${index * 30}px`,
                left: `${(index + 1) * 50}px`,
                zIndex: imgDragSwag - index,
                transition: 'z-index 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            >
              <img
                onLoad={() => handleImageLoad(cover.id)}
                className="imageHome"
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
          <Draggable key={`mobile-${cover.id}`}>
            <div
              onClick={handleClick}
              className="imgDragClass"
              style={{
                position: 'fixed',
                marginTop: `${index * 40}px`,
                left: `${(index + 1) * 15}px`,
                zIndex: 10 - index,
                transition: 'z-index 0.2s ease-in-out',
                cursor: 'pointer',
              }}
            >
              <img
                onLoad={() => handleImageLoad(cover.id)}
                className="imageHomeMobile"
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
