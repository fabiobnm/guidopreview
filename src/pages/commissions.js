import { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS, GET_POSTSOrderComm } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSOrderComm, { client });
  const [hoverText, setHoverText] = useState("Commissioned works"); // Testo predefinito
  const [loadedImages, setLoadedImages] = useState({});


  // Ref per il div che vogliamo scrollare
  const commissionsDivRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX - commissionsDivRef.current.offsetLeft;
    scrollLeft.current = commissionsDivRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.clientX - commissionsDivRef.current.offsetLeft;
    const scroll = x - startX.current;
    commissionsDivRef.current.scrollLeft = scrollLeft.current - scroll;
  };

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  console.log('cicici' + data);

  return (
    <main style={{ marginTop: '75px' }}>
      <div
        className="commissionsDiv"
        ref={commissionsDivRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'grab' }} // Mostra il cursore come se fosse un "drag"
      >
       {data.commission.commission.map((commissions) => (
  <div key={commissions.id}>
    <img
      className="imgCommission"
      src={commissions.img.url}
      onLoad={() => handleImageLoad(commissions.id)}
      onMouseEnter={() => setHoverText(commissions.text)}
      onMouseLeave={() => setHoverText(" ")}
      style={{
        opacity: loadedImages[commissions.id] ? 1 : 0
       
      }}
    />
    <div
      className="commissionTextMobile"
      style={{ color: 'black', margin: '25px', marginBottom: '100px' }}
      dangerouslySetInnerHTML={{ __html: commissions.text }}
    ></div>
  </div>
))}
      </div>
      <div
        className="commissionTextDesktop"
        style={{ width: '50%', color: 'black', marginLeft: '45px', marginTop: '20px' }}
        dangerouslySetInnerHTML={{ __html: hoverText }}
      ></div>

      <Sidebar />
    </main>
  );
}
