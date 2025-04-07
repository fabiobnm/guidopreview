import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query {
    progettis {
      id
      nome
      info
      
      galleria(first: 100) {
        url
      }
    }
  }
`;

export const GET_POSTSOrdine = gql`
  query {
 ordineDeiWorks{
  id
  works(first:100){
    ... on Progetti{
      id
      nome
      galleria(first:1000){
        url
      }
      video{
      id
        thumbnail{url}
        fileVideo{url}
      }
    }
  }
}
}
`;

export const GET_POSTSCommissions = gql`
query {
  commissions(first:100){
    id
    immagine{url}
    infoWork{html}
  }
  }
`;

export const GET_POSTSOrderComm = gql`

{
  commission(where: {id: "cm8ix58nt52al08mhrhprxuen"}) {
    commission(first: 200){
      img{url}
      text
      
    }
  }
}
`;





export const GET_POSTSAbout = gql`
query {
  abouts {
    biography{
    html}
    education{
    html}
    cv{
    html}
    immagine{
      url
    }
    fanzine(first:100){
      text
      img{url}
      gallery(first:100){url}

      
    }
    books(first:100){
      text
      img{url}
      gallery(first:100){url}

    }
  }
}
`;

export const GET_POSTSHomePage = gql`
query{
  homePages{
    cover{url}
  }
}
`;


export const GET_POSTSDailyDose2025DEF = gql`
  query {
   dailyDose2025S {
     id
    gallery(first: 370, orderBy: id_DESC){
      id
      
        url
      
      
    }
   }  
}
`;

export const GET_POSTSDailyDose2025 = gql`
  query {
   dailyDose2025S {
     id
    post(first: 370, orderBy: id_DESC){
      id
      foto{
        url
        
      }
      gallery{
      url
      }
      testo
      
    }
   }  
}
`;

export const GET_POSTSToday = gql`
query MyQuery {
  progetti(where: {id: "cm2kk8clmkobm07l6qhrydbxa"}) {
    nome
   galleria(first: 100){
      url
    }
  }
}
`;

export const GET_POSTSRussia = gql`
query MyQuery {
  progetti(where: {id: "cm3jci1bv5wfp07mv8oglvn8t"}) {
    nome
   galleria(first: 100){
      url
    }
  }
}
`;

export const GET_POSTSDailyDose = gql`
query MyQuery {
  progetti(where: {id: "cm3jct37h5xvj07mv04uslila"}) {
    nome
   galleria(first: 100){
      url
    }
  }
}
`;

export const GET_POSTSHome = gql`
  query {
    homePages {
      id
      cover {
        url
      }
    }
  }
`;


export const GET_POSTSEduc = gql`
  query {
  educationals {
    id
    titolo
    copertina{
      id
      url
    }
      retro{
      id
      url
    }
    info
    
    
  }
  }
  `;



export const GET_POSTSEducNew = gql`
query {
    workshops{
     text{html}
     educational{
       ... on Educational{
         copertina{url}
         retro{url}
       }
     }
   }
     }

`;



export const GET_POSTS2 = gql`
  query {
    progettis {
      id
      nome
      info
      cover {
        id
        url
      }
      galleria(first: 3) {
        url
      }
    }
  }
`;
