// import React from 'react';
// import { Toast } from '@flowbite/react';
// import { X } from 'lucide-react';

// // rafce
// const ToastProvider = () => {
//   // Placeholder for provider (handled by Flowbite context)
// };

// const ToastViewport = ({ className, ...props }) => (
//   <div
//     className={
//       'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]' +
//       (className ? ' ' + className : '')
//     }
//     {...props}
//   />
// );
// ToastViewport.displayName = 'ToastViewport';

// const Toast = ({ className, children, ...props }) => {
//   return (
//     <Toast {...props} className={className}>
//       {children}
//     </Toast>
//   );
// };
// Toast.displayName = 'Toast';

// const ToastAction = ({ className, ...props }) => (
//   <button
//     className={
//       'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50' +
//       (className ? ' ' + className : '')
//     }
//     {...props}
//   />
// );
// ToastAction.displayName = 'ToastAction';

// const ToastClose = ({ className, onClick, ...props }) => (
//   <button
//     onClick={onClick}
//     className={
//       'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring' +
//       (className ? ' ' + className : '')
//     }
//     {...props}
//   >
//     <X className="h-4 w-4" />
//   </button>
// );
// ToastClose.displayName = 'ToastClose';

// const ToastTitle = ({ className, ...props }) => (
//   <div
//     className={
//       'text-sm font-semibold' +
//       (className ? ' ' + className : '')
//     }
//     {...props}
//   />
// );
// ToastTitle.displayName = 'ToastTitle';

// const ToastDescription = ({ className, ...props }) => (
//   <div
//     className={
//       'text-sm opacity-90' +
//       (className ? ' ' + className : '')
//     }
//     {...props}
//   />
// );
// ToastDescription.displayName = 'ToastDescription';

// export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
