"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function AdminModal({ title, description, onClose, children }: Props) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="adminModalBackdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="adminModal" role="dialog" aria-modal="true" aria-label={title}>
        <header className="adminModalHeader">
          <div>
            <span className="kicker">TRIPPLE S · CATALOGUE</span>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="adminModalClose" type="button" onClick={onClose} aria-label="Close editor"><X size={20}/></button>
        </header>
        <div className="adminModalBody">{children}</div>
      </section>
    </div>
  );
}
