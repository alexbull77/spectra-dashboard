import {
  DndContext,
  DragEndEvent,
  closestCenter,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { FpsChart } from "../components/fps/FpsChart";
import { MemoryChart } from "../components/memory/MemoryChart";
import { EventLoopChart } from "../components/event-loop/EventLoopLogsChart";

const chartMap: Record<string, React.FC<{ sessionId: string }>> = {
  fps: FpsChart,
  memory: MemoryChart,
  event_loop: EventLoopChart,
};

export const DraggableWidgets: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const [chartOrder, setChartOrder] = useState<UniqueIdentifier[]>([
    "fps",
    "memory",
    "event_loop",
  ]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = chartOrder.indexOf(active.id);
      const newIndex = chartOrder.indexOf(over.id);
      setChartOrder(arrayMove(chartOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={chartOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex gap-4 flex-wrap">
          {chartOrder.map((id) => {
            const ChartComponent = chartMap[id];
            return (
              <SortableItem key={id} id={id}>
                <ChartComponent sessionId={sessionId} />
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const SortableItem: React.FC<{
  id: UniqueIdentifier;
  children: React.ReactNode;
}> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isOver } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    width: 450,
    boxShadow: isOver
      ? "0 0 12px 4px rgba(0, 153, 255, 0.75)" // Glowing blue effect
      : undefined,
    borderRadius: 16,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-white ${isOver ? "ring-2 ring-blue-400" : ""}`}
    >
      {children}
    </div>
  );
};
