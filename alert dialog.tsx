'use client';

import * as React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

// -----------------------------
// Root
// -----------------------------
const AlertDialog = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>
>((props, ref) => (
  <AlertDialogPrimitive.Root ref={ref} data-slot="alert-dialog" {...props} />
));
AlertDialog.displayName = 'AlertDialog';

// -----------------------------
// Trigger
// -----------------------------
const AlertDialogTrigger = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>
>((props, ref) => (
  <AlertDialogPrimitive.Trigger ref={ref} data-slot="alert-dialog-trigger" {...props} />
));
AlertDialogTrigger.displayName = 'AlertDialogTrigger';

// -----------------------------
// Portal
// -----------------------------
const AlertDialogPortal = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>
>((props, ref) => (
  <AlertDialogPrimitive.Portal ref={ref} data-slot="alert-dialog-portal" {...props} />
));
AlertDialogPortal.displayName = 'AlertDialogPortal';

// -----------------------------
// Overlay
// -----------------------------
interface AlertDialogOverlayProps extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
  animated?: boolean;
}

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, AlertDialogOverlayProps>(
  ({ className, animated = true, ...props }, ref) => (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      data-slot="alert-dialog-overlay"
      className={cn(
        animated
          ? 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          : '',
        'fixed inset-0 z-50 bg-black/50',
        className
      )}
      {...props}
    />
  )
);
AlertDialogOverlay.displayName = 'AlertDialogOverlay';

// -----------------------------
// Content
// -----------------------------
interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
  animated?: boolean;
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, animated = true, ...props }, ref) => (
    <AlertDialogPortal>
      <AlertDialogOverlay animated={animated} />
      <AlertDialogPrimitive.Content
        ref={ref}
        data-slot="alert-dialog-content"
        className={cn(
          'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg sm:max-w-lg',
          animated
            ? 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
            : '',
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
);
AlertDialogContent.displayName = 'AlertDialogContent';

// -----------------------------
// Header & Footer
// -----------------------------
const AlertDialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-dialog-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
);
AlertDialogHeader.displayName = 'AlertDialogHeader';

const AlertDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
);
AlertDialogFooter.displayName = 'AlertDialogFooter';

// -----------------------------
// Title & Description
// -----------------------------
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    data-slot="alert-dialog-title"
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
));
AlertDialogTitle.displayName = 'AlertDialogTitle';

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    data-slot="alert-dialog-description"
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
AlertDialogDescription.displayName = 'AlertDialogDescription';

// -----------------------------
// Action & Cancel buttons
// -----------------------------
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & { children?: React.ReactNode }
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
));
AlertDialogAction.displayName = 'AlertDialogAction';

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel> & { children?: React.ReactNode }
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), className)}
    {...props}
  />
));
AlertDialogCancel.displayName = 'AlertDialogCancel';

// -----------------------------
// Default Export
// -----------------------------
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};

