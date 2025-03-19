import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NewsButt = () => {
  const router = useRouter(); // Ottieni il percorso attuale

  return (
    <div className='dailyButton'>
       <Link 
              href="/dailydose2025"
              style={styles.news}
            >
              daily dose 2025
            </Link>
    
    </div>
  );
};

const styles = {
  gigio: {
    width: 'auto',
    backgroundColor: 'none',
    paddingLeft: '45px',
    paddingRight: '45px',
    paddingTop: '20px',
    position: 'fixed',
    bottom: '5%',
    right:'0px'
  },
  news:{
backgroundColor:'#002fa7',
color:'white',
padding:'5px',
fontSize:'25px',
  },
  
};

export default NewsButt;
