import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSAbout } from '../lib/queries';
import Sidebar from '../components/Sidebar'; 
import { useState } from 'react';

export default function Home() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX + 10, y: e.clientY - 200 }); // Sposta leggermente l'immagine sopra al cursore
  };

  const tourData = [
    { id: 1, title: "MAUTKAKUAN (2023)", imgSrc: "./fanze/FRWL.png" },
    { id: 2, title: "NOVEMBER (2022)", imgSrc: "./fanze/SREAM.png" },
    { id: 3, title: "Casbah Flow (2022)", imgSrc: "" },
    { id: 4, title: "Later is Better (2021)", imgSrc: "" },
    { id: 5, title: "SPRING TOUR (2018)", imgSrc: "./fanze/SPRING.png" },
    { id: 6, title: "Awake\Tiger (2017)", imgSrc: "./fanze/LEUTE.png" },
    { id: 7, title: "Smash Guitar (2017)", imgSrc: "./fanze/SMASH.png" },
    { id: 8, title: "PA\MA (2016)", imgSrc: "./fanze/LEUTE.png" },
    { id: 8, title: "Here (2016)", imgSrc: "./fanze/HERE.png" },
  ];

  const { loading, error, data } = useQuery(GET_POSTSAbout, { client });

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

  return (
    <main>
      <div className="divCommissions">
        <img className="imgAbout" src={data.abouts[0].immagine.url} />
        <p className="pAbout">
          <div className="aboutBio" dangerouslySetInnerHTML={{ __html: data.abouts[0].biography.html }}></div>
        </p>
      </div>
      <div className="aboutText" dangerouslySetInnerHTML={{ __html: data.abouts[0].cv.html }}></div>


      <div className='divBookZine'>       
        <p style={{color:'black',fontWeight: 'bolder'}}>Books:</p>
        {data.abouts[0].books.map((tour) => (
          <p
            key={tour.id}
            onMouseEnter={() => setHoveredImage(tour.img?.url)}
            onMouseLeave={() => setHoveredImage(null)}
            onMouseMove={handleMouseMove}
            style={{ cursor: 'pointer', margin: '0px' , marginTop:'1px', color:'black', width: 'fit-content'}} // Aggiunge margine tra i <p>
          >
            {tour.text}
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
        {data.abouts[0].fanzine.map((tour) => (
          <p
            key={tour.id}
            onMouseEnter={() => setHoveredImage(tour.img?.url)}
            onMouseLeave={() => setHoveredImage(null)}
            onMouseMove={handleMouseMove}
            style={{ cursor: 'pointer', margin: '0px' , marginTop:'1px', color:'black', width: 'fit-content'}} // Aggiunge margine tra i <p>
          >
            {tour.text}
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

      <Sidebar />
    </main>
  );
}
