import { useState } from 'react';
import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS, GET_POSTSCommissions } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import { useSpring, animated } from '@react-spring/web';

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSCommissions, { client });
  const [hoverText, setHoverText] = useState("Commissioned works"); // Testo predefinito



  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Errore nella query:', error.message);
    return <p>Error: {error.message}</p>;
  }

console.log('cicici'+ data.commissions[0].infoWork.html);

  return (
    <main style={{ marginTop: '75px' }}>
      <div className='commissionsDiv'>
      {data.commissions.map((commissions) => (
        <div key={commissions.id}>
              <img
                className='imgCommission'
                src={commissions.immagine.url}              
                onMouseEnter={() => setHoverText(commissions.infoWork?.html)} // Cambia il testo quando passi sopra
                onMouseLeave={() => setHoverText(" ")} // Ripristina il testo originale quando esci
            
            />
           
           <div className='commissionTextMobile' style={{width:'50%', color:'black',margin:'25px', marginBottom: '100px'}} dangerouslySetInnerHTML={{ __html: commissions.infoWork?.html }}></div>
        
        </div>
      ))}
     
      </div>
      <div className='commissionTextDesktop'  style={{width:'50%', color:'black',marginLeft:'45px', marginTop:'20px'}} dangerouslySetInnerHTML={{ __html: hoverText }}></div>

      <Sidebar />
    </main>
  );
}
