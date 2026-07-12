interface CardProps { children: React.ReactNode; className?: string; onClick?: () => void; }
export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div onClick={onClick} className={`bg-surface border border-border rounded-xl shadow-card ${onClick ? "cursor-pointer hover:border-accent transition-colors" : ""} ${className}`}>
      {children}
    </div>
  );
}
