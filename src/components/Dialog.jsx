// src/components/Dialog.jsx
import React from 'react';
import { Modal } from 'flowbite-react';
import { X } from 'lucide-react';

const Dialog = ({ show, onClose, header, body, footer }) => {
  if (!Modal) {
    console.error('Modal component is undefined. Check flowbite-react installation.');
    return null;
  }

  return (
    <Modal show={show} onClose={onClose} popup size="md">
      <Modal.Header className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between w-full">
          {header && <div>{header}</div>} {/* Wrap header in a div to ensure valid rendering */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </Modal.Header>
      {/* <Modal.Body className="p-6">
        {body && <div>{body}</div>} {/* Wrap body in a div 
      </Modal.Body> */}
      {/* <Modal.Footer className="p-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
        {footer && <div>{footer}</div>} {/* Wrap footer in a div 
      </Modal.Footer> */}
    </Modal>
  );
};

export default Dialog;