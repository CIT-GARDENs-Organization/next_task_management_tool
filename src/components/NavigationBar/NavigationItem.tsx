import Link from "next/link";
import {ReactNode} from "react";

interface NavigationItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isWide: boolean;
}

export default function NavigationItem({
  href,
  icon,
  label,
  isWide,
}: NavigationItemProps) {
  return (
    <Link href={href}>
      <div className="relative flex items-center mt-6 justify-start hover:text-neutral-500 group">
        <div className="icon-wrapper">{icon}</div>
        {isWide ? (
          <span className="ml-4 font-bold">{label}</span>
        ) : (
          <span className="tooltip">{label}</span>
        )}
      </div>
      <style jsx>{`
        .icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .tooltip {
          position: absolute;
          top: 50%;
          left: calc(100% + 8px);
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          display: block;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .group:hover .tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(0.5rem);
        }

        @media (max-width: 768px) {
          .tooltip {
            font-size: 10px;
          }
        }
      `}</style>
    </Link>
  );
}
