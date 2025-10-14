"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Card {
  title: string;
  src: string;
  description?: string;
}

interface FocusCardsProps {
  cards: Card[];
  className?: string;
}

export function FocusCards({ cards, className }: FocusCardsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto",
        className
      )}
    >
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative group cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="relative overflow-hidden rounded-xl bg-lime-50 border border-lime-200 shadow-sm hover:shadow-md transition-all duration-300 group-hover:shadow-lg">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={card.src}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                fill
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative p-6 h-64 flex flex-col justify-end">
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-lime-200 transition-colors duration-300">
                {card.title}
              </h3>
              {card.description && (
                <p className="text-lime-100 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {card.description}
                </p>
              )}
            </div>

            {/* Hover Effect Overlay */}
            {hoveredIndex === index && (
              <div
                className="absolute inset-0 bg-lime-500/10 rounded-xl pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(132, 204, 22, 0.1), transparent 40%)`,
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
