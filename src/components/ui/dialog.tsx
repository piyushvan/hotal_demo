import React from "react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, children }: DialogProps) {
  if (!isOpen) return null;
  return (
    <div className="dialog" onClick={onClose}>
      {children}
    </div>
  );
}
