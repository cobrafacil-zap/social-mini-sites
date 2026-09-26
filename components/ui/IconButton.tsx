import Link from "next/link";

/**
 * Botão de ação com tooltip puro em CSS (sem JS, sem deps).
 * `as="a"` para links externos, `as="link"` para rotas internas.
 */
type BaseProps = {
  label: string;
  children: React.ReactNode;
  danger?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function IconButton({
  label, children, danger, className = "", ...rest
}: BaseProps) {
  return (
    <span className="tip-wrap">
      <button
        type={rest.type ?? "button"}
        onClick={rest.onClick}
        disabled={rest.disabled}
        className={`icon-btn ${danger ? "icon-btn-danger" : ""} ${className}`}
      >
        {children}
      </button>
      <span className="tip" role="tooltip">{label}</span>
    </span>
  );
}

export function IconLink({
  label, href, children, danger, className = "", external,
}: BaseProps & { href: string; external?: boolean }) {
  return (
    <span className="tip-wrap">
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`icon-btn ${danger ? "icon-btn-danger" : ""} ${className}`}
      >
        {children}
      </Link>
      <span className="tip" role="tooltip">{label}</span>
    </span>
  );
}
