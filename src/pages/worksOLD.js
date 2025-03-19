import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import NewsButt from '../components/tastoNews';



export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client });

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

  console.log('Dati ricevuti:', data);

  return (
    <main style={{marginTop:'125px'}}>
      {data.progettis.map((progetto) => (
        <div style={{height:'auto', margin:'0px', paddingLeft:'45px', paddingRight:'45px'}} key={progetto.id}>
                      <h1 style={{color:'black', fontSize:'28px', textAlign:'center', padding:'50px'}}>{progetto.nome}</h1>

          <div className='caros'>
            {progetto.galleria.map((image, index) => (
              <div
              key={index}
              className="gallery-image-container"
              style={{
                width: '100%', // Imposta la larghezza
                // Altezza massima per il ritaglio
                height:'auto',
                overflow: 'hidden', // Ritaglia il contenuto eccedente
                margin: 'auto',
                marginRight: '0px',
              }}
            >
              <img
                src={image.url}
                alt={`${progetto.nome} galleria ${index}`}
                style={{ width: '100%', objectFit: 'cover' }} // Adatta l'immagine al contenitore
              />
            </div>
            ))}
          </div>
        </div>
      ))}

      <Sidebar />
      <NewsButt />
    </main>
  );
}

