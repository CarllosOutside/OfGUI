import { Draggable } from "react-beautiful-dnd";

export const Drag = ({ id, index, ...props }) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          //Cada dragable tem um div da classe dragable, que é filho de um Drop
          <div
            ref={provided.innerRef}
            className={snapshot.isDragging ? "draggable dragging" : "draggable"}
            {...provided.draggableProps}
            {...props}
          >
            <div className="drag-handle" {...provided.dragHandleProps}>
              {props.children}{" "}
              {/**cada cartao dragable é da classe drag_handle filho de dragable */}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
