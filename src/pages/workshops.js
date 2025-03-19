import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSEducNew } from '../lib/queries';
import Sidebar from '../components/Sidebar'; 
import NewsButt from '../components/tastoNews';


export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSEducNew, { client });

  if (loading) return <p>Loading...</p>;
  if (error) {
    alert('err');
    console.error('Errore nella query:', error.message);
    console.error('Dettagli dell\'errore:', error.graphQLErrors);
    console.error('Dettagli della risposta:', error.networkError);
    return <p>Error: {error.message}</p>;
  }

  console.log('Dati ricevuti:', data.workshops[0]);

  return (
    <main>
    <div className='textWorkshops'  dangerouslySetInnerHTML={{ __html: data.workshops[0].text.html }}></div>
      <div className="educational">
        
        {data.workshops[0].educational.map((progetto) => (
         
          
          <div className="cardWorkshops" key={progetto.id}>
  <div className="card-inner">
    {/* Lato frontale */}
    <div className="card-front">
      <img 
        style={{  width: '100%' }} 
        src={progetto.copertina.url} 
        alt={progetto.nome} 
      />
    </div>
    
    {/* Lato posteriore */}
    <div className="card-back">
      <img 
        style={{ height: '400px', width: '100%' }} 
        src={progetto.retro.url} 
        alt={`${progetto.nome} Retro`} 
      />
    </div>
  </div>
</div>
          
        ))}

      </div>
      
      <Sidebar />
    </main>
  );
}
