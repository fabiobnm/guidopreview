import { useQuery } from '@apollo/client';
import client from '../lib/apolloClient';
import { GET_POSTS , GET_POSTS2 } from '../lib/queries';
import Sidebar from '../components/Sidebar';
import Prova from '../components/Provino';


export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS, { client, variables: { limit: 20 } });

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
    <main style={{marginTop:'125px',background:''}}>
      {data.progettis.map((progetto) => (
        <Prova  progetto={progetto} />
        
      ))}

      <Sidebar />
    </main>
  );
}

