import Draggable from 'react-draggable';
import React from 'react'


export default function DraggableComponents() {
  return (
    <div className="draggable-container">
      <h3>GeeksforGeeks - Draggable Components</h3>
      <Draggable>
       <div>       <img src='https://www.quattrozampeinfamiglia.it/wp-content/uploads/2024/10/cani-da-riporto.jpg'/>
       </div>
      </Draggable>
      <Draggable>
        <div className="draggable-box">Moe me!</div>
      </Draggable>

    </div>
  );
}