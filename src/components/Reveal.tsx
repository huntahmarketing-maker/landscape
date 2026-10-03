import { useScrollReveal } from '@/hooks/useScrollReveal';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in-up' | 'fade-in-down' | 'fade-in' | 'scale-in' | 'slide-in-left' | 'slide-in-right';
  delay?: number;
};

export function Reveal({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = 0,
}: RevealProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? `animate-${animation}` : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
