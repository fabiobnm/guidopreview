import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTSAbout } from '../lib/queries';
import Sidebar from '../components/Sidebar'; 
import NewsButt from '../components/tastoNews';


export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTSAbout, { client });

  if (loading) return <p>Loading...</p>;
  if (error) {
    alert('err')
    console.log('ciaoooo')
    console.log(data)
    
    console.error('Errore nella query:', error.message);
    console.error('Dettagli dell\'errore:', error.graphQLErrors);
    console.error('Dettagli della risposta:', error.networkError);
    return <p>Error: {error.message}</p>;
  }

  console.log('Dati ricevuti:', data.abouts[0]);

  return (
    <main>

      <div className='divCommissions'>
      <img className='imgAbout' 
       src={ data.abouts[0].immagine.url}/>
     <p className='pAbout'> 
      <div className='aboutBio' dangerouslySetInnerHTML={{ __html: data.abouts[0].biography.html }}></div></p>
         
    </div>
    <div className='aboutText' dangerouslySetInnerHTML={{ __html: data.abouts[0].cv.html }}></div>


<Sidebar />

    </main>
  );
}
