import { useBackgroundQuery } from '@apollo/client';
import React from 'react';


const Prova = ({progetto,isRed}) =>{
    return(
        <div style={isRed ? styles.box2 : styles.box1} key={progetto.id}>
                      <h1 style={{color:'red'}}>{progetto.nome}</h1>
          <div className='caros'>
            {progetto.galleria.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${progetto.nome} galleria ${index}`}
                style={{  height: '20vH', marginLeft: '10px' }} // Stile per le immagini della galleria
              />
            ))}
          </div>
        </div>
    )
}

const styles = {
box1:{
    height:'auto',
     margin:'0px'
},
box2:{
    height:'auto',
     margin:'0px',
     background:'red'
}

}


export default Prova;
