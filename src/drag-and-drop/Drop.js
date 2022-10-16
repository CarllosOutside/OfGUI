import { Droppable } from "react-beautiful-dnd";

export const Drop = ({ id, type, ...props }) => {
  return (
    <Droppable droppableId={id} type={type}>
      {(provided, snapshot) => {
        return (
          //cada dropable é um div
          <div
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver ? "droppable dropping" : "droppable"
            }
            {...provided.droppableProps}
            {...props}
          >
            {props.children} {/**imprime tudo que é filho de <Prop/> */}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};
