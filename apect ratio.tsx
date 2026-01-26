'use client';

import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

interface AspectRatioProps extends React.ComponentProps<typeof AspectRatioPrimitive.Root> {
  /** Aspect ratio (width / height). Defaults to 1 (square) */
  ratio?: number;
}

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ ratio = 1, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    data-slot="aspect-ratio"
    ratio={ratio}
    {...props}
  />
));

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };

