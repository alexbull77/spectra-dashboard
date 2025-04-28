import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { NetworkRequestTimeTakenChart } from "./charts/NetworkRequestTimeTakenChart";
import { NetworkRequestUrlHeatmap } from "./charts/NetworkRequestUrlHeatmap";
import { NetworkResponseSizeChart } from "./charts/NetworkResponseSizeChart";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RepeatedNetworkRequestsChart } from "./charts/RepeatedNetworkRequestsChart";

const chartMap: Record<string, React.FC> = {
  time: NetworkRequestTimeTakenChart,
  size: NetworkResponseSizeChart,
  repeated: RepeatedNetworkRequestsChart,
  url: NetworkRequestUrlHeatmap,
};

export const DraggableRequestWidgets = () => {
  const [chartOrder, setChartOrder] = useState<UniqueIdentifier[]>([
    "time",
    "size",
    "url",
    "repeated",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // only start drag if mouse moves 8px
      },
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      const oldIndex = chartOrder.indexOf(active.id);
      const newIndex = chartOrder.indexOf(over.id);
      setChartOrder(arrayMove(chartOrder, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={chartOrder}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex gap-4 flex-wrap">
          {chartOrder.map((id) => {
            const ChartComponent = chartMap[id];
            return (
              <SortableItem key={id} id={id}>
                <ChartComponent />
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
    width: 460,
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
