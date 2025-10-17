'use client';

import type {
  Announcements,
  DndContextProps,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import tunnel from 'tunnel-rat';
import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const t = tunnel();

export type { DragEndEvent } from '@dnd-kit/core';

type KanbanItemProps = {
  id: string;
  name: string;
  column: string;
} & Record<string, unknown>;

type KanbanColumnProps = {
  id: string;
  name: string;
} & Record<string, unknown>;

type KanbanContextProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = {
  columns: C[];
  data: T[];
  activeCardId: string | null;
};

const KanbanContext = createContext<KanbanContextProps>({
  columns: [],
  data: [],
  activeCardId: null,
});

export type KanbanBoardProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className={cn(
        'flex size-full min-h-40 flex-col divide-y overflow-hidden rounded-md border bg-secondary text-xs shadow-sm ring-2 transition-all',
        isOver ? 'ring-primary' : 'ring-transparent',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  showClickButton?: boolean;
  clickButtonText?: string;
  isLoading?: boolean;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
  id,
  name,
  children,
  className,
  onClick,
  showClickButton = false,
  clickButtonText = "View Details",
  isLoading = false,
}: KanbanCardProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
    isDragging,
  } = useSortable({
    id,
  });
  const { activeCardId } = useContext(KanbanContext) as KanbanContextProps;

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Remove card click functionality - only button clicks

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onClick) {
      console.log('KanbanCard button clicked:', { id, name, isDragging });
      onClick();
    }
  };

  const handleButtonMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleButtonMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <>
      <div style={style} ref={setNodeRef}>
        <Card
          className={cn(
            'gap-4 rounded-md p-3 shadow-sm relative cursor-grab hover:shadow-md transition-shadow duration-200',
            isDragging && 'pointer-events-none cursor-grabbing opacity-30',
            className
          )}
          {...listeners}
          {...attributes}
          data-kanban-card="true"
        >
          <div className="h-full">
            {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
            
            {showClickButton && onClick && (
              <div 
                className="mt-3 pt-3 border-t border-gray-200"
                onMouseDown={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                data-kanban-button-area="true"
              >
                <button
                  onClick={handleButtonClick}
                  onMouseDown={handleButtonMouseDown}
                  onMouseMove={handleButtonMouseMove}
                  disabled={isLoading}
                  aria-label={`${clickButtonText} for ${name}`}
                  className="w-full bg-lime-600 hover:bg-lime-700 disabled:bg-lime-400 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                  style={{ 
                    pointerEvents: 'auto',
                    touchAction: 'manipulation',
                    userSelect: 'none'
                  }}
                >
                  {isLoading ? (
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                  {isLoading ? 'Loading...' : clickButtonText}
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
      {activeCardId === id && (
        <t.In>
          <Card
            className={cn(
              'gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary relative cursor-grab',
              isDragging && 'cursor-grabbing',
              className
            )}
            {...listeners}
            {...attributes}
            data-kanban-card="true"
          >
            <div className="h-full">
              {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
              
              {showClickButton && onClick && (
                <div 
                  className="mt-3 pt-3 border-t border-gray-200"
                  onMouseDown={(e) => e.stopPropagation()}
                  onMouseMove={(e) => e.stopPropagation()}
                  onMouseUp={(e) => e.stopPropagation()}
                  data-kanban-button-area="true"
                >
                  <button
                    onClick={handleButtonClick}
                    onMouseDown={handleButtonMouseDown}
                    onMouseMove={handleButtonMouseMove}
                    disabled={isLoading}
                    aria-label={`${clickButtonText} for ${name}`}
                    className="w-full bg-lime-600 hover:bg-lime-700 disabled:bg-lime-400 disabled:cursor-not-allowed text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    style={{ 
                      pointerEvents: 'auto',
                      touchAction: 'manipulation',
                      userSelect: 'none'
                    }}
                  >
                    {isLoading ? (
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                    {isLoading ? 'Loading...' : clickButtonText}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </t.In>
      )}
    </>
  );
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> =
  Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> & {
    children: (item: T) => ReactNode;
    id: string;
  };

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
  children,
  className,
  ...props
}: KanbanCardsProps<T>) => {
  const { data } = useContext(KanbanContext) as KanbanContextProps<T>;
  const filteredData = data.filter((item) => item.column === props.id);
  const items = filteredData.map((item) => item.id);

  return (
    <ScrollArea className="overflow-hidden">
      <SortableContext items={items}>
        <div
          className={cn('flex flex-grow flex-col gap-2 p-2', className)}
          {...props}
        >
          {filteredData.map(children)}
        </div>
      </SortableContext>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
  <div className={cn('m-0 p-2 font-semibold text-sm', className)} {...props} />
);

export type KanbanProviderProps<
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
> = Omit<DndContextProps, 'children'> & {
  children: (column: C) => ReactNode;
  className?: string;
  columns: C[];
  data: T[];
  onDataChange?: (data: T[]) => void;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
};

export const KanbanProvider = <
  T extends KanbanItemProps = KanbanItemProps,
  C extends KanbanColumnProps = KanbanColumnProps,
>({
  children,
  onDragStart,
  onDragEnd,
  onDragOver,
  className,
  columns,
  data,
  onDataChange,
  ...props
}: KanbanProviderProps<T, C>) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    console.log('🎯 Drag started:', event.active.id);
    const card = data.find((item) => item.id === event.active.id);
    if (card) {
      setActiveCardId(event.active.id as string);
    }
    onDragStart?.(event);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    if (!(activeItem)) {
      return;
    }

    const activeColumn = activeItem.column;
    const overColumn =
      overItem?.column ||
      columns.find(col => col.id === over.id)?.id ||
      columns[0]?.id;

    // Don't call onDataChange during drag over - only update visual state
    onDragOver?.(event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('🎯 Drag ended:', event.active.id, 'over:', event.over?.id);
    setActiveCardId(null);

    onDragEnd?.(event);

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Handle column changes in drag end
    const activeItem = data.find((item) => item.id === active.id);
    const overItem = data.find((item) => item.id === over.id);

    if (!activeItem) {
      return;
    }

    const activeColumn = activeItem.column;
    const overColumn =
      overItem?.column ||
      columns.find(col => col.id === over.id)?.id ||
      columns[0]?.id;

    console.log('🎯 Kanban handleDragEnd:', { 
      activeId: active.id, 
      overId: over.id, 
      activeColumn, 
      overColumn,
      overItem: overItem?.column,
      columnId: columns.find(col => col.id === over.id)?.id
    });

    if (activeColumn !== overColumn) {
      console.log('🔄 Column change detected in Kanban!');
      let newData = [...data];
      const activeIndex = newData.findIndex((item) => item.id === active.id);

      newData[activeIndex].column = overColumn;
      console.log('🔄 Updated lead column:', newData[activeIndex]);
      // Don't reorder when changing columns, just update the column
      onDataChange?.(newData);
    } else {
      console.log('🔄 No column change, reordering within same column');
      // Only reorder within the same column
      let newData = [...data];
      const oldIndex = newData.findIndex((item) => item.id === active.id);
      const newIndex = newData.findIndex((item) => item.id === over.id);

      newData = arrayMove(newData, oldIndex, newIndex);
      onDataChange?.(newData);
    }
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      const { name, column } = data.find((item) => item.id === active.id) ?? {};

      return `Picked up the card "${name}" from the "${column}" column`;
    },
    onDragOver({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dragged the card "${name}" over the "${newColumn}" column`;
    },
    onDragEnd({ active, over }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};
      const newColumn = columns.find((column) => column.id === over?.id)?.name;

      return `Dropped the card "${name}" into the "${newColumn}" column`;
    },
    onDragCancel({ active }) {
      const { name } = data.find((item) => item.id === active.id) ?? {};

      return `Cancelled dragging the card "${name}"`;
    },
  };

  return (
    <KanbanContext.Provider value={{ columns, data, activeCardId }}>
      <DndContext
        accessibility={{ announcements }}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        sensors={sensors}
        {...props}
      >
        <div
          className={cn(
            'grid size-full auto-cols-fr grid-flow-col gap-4',
            className
          )}
        >
          {columns.map((column) => children(column))}
        </div>
        {typeof window !== 'undefined' &&
          createPortal(
            <DragOverlay>
              <t.Out />
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </KanbanContext.Provider>
  );
};