import { useState } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS, GET_POSTSOrderComm } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSOrderComm, { client });
  const [hoverText, setHoverText] = useState("Commissioned works"); // Testo predefinito



  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

console.log('cicici'+ data);

  return (
    <main style={{ marginTop: '75px' }}>
      <div className='commissionsDiv'>
      {data.commission.commission.map((commissions) => (
        <div key={commissions.id}>
              <img
                className='imgCommission'
                src={commissions.img.url}              
                onMouseEnter={() => setHoverText(commissions.text)} // Cambia il testo quando passi sopra
                onMouseLeave={() => setHoverText(" ")} // Ripristina il testo originale quando esci
            />
           
           <div className='commissionTextMobile' style={{ color:'black',margin:'25px', marginBottom: '100px'}} dangerouslySetInnerHTML={{ __html: commissions.infoWork?.html }}></div>
        
        </div>
      ))}
     
      </div>
      <div className='commissionTextDesktop'  style={{width:'50%', color:'black',marginLeft:'45px', marginTop:'20px'}} dangerouslySetInnerHTML={{ __html: hoverText }}></div>

      <Sidebar />
    </main>
  );
}
