'use client';

import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const CardDemo = () => {
  const cards = [
    { id: 1, title: 'Mountain View', image: '/images/mountain.jpg' },
    { id: 2, title: 'Beach Sunset', image: '/images/beach.jpg' },
    { id: 3, title: 'City Lights', image: '/images/city.jpg' },
    { id: 4, title: 'Forest Trail', image: '/images/forest.jpg' },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.id} className="rounded-lg overflow-hidden shadow-lg bg-white">
          <AspectRatio ratio={16 / 9}>
            <img
              src={card.image}
              alt={card.title}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="p-4">
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardDemo;

