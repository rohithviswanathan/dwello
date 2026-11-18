import { useState, type ImgHTMLAttributes } from "react";

type AvatarSize = "sm" | "md" | "lg" | "xl";
type AvatarShape = "circle" | "square";
type AvatarStatus = "online" | "offline" | "busy";

interface AvatarProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  alt?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const statusStyles: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-subtle",
  busy: "bg-danger",
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function Avatar({
  src,
  name,
  size = "md",
  shape = "circle",
  status,
  alt,
  className = "",
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = Boolean(src) && !imageError;

  return (
    <span
      className={`
        relative inline-flex shrink-0 items-center justify-center
        overflow-visible bg-brand-light font-extrabold text-brand
        ring-1 ring-border/80
        ${sizeStyles[size]}
        ${shape === "circle" ? "rounded-full" : "rounded-xl"}
        ${className}
      `}
      aria-label={name}
    >
      {showImage ? (
        <img
          src={src!}
          alt={alt ?? name}
          className={`
            h-full w-full object-cover
            ${shape === "circle" ? "rounded-full" : "rounded-xl"}
          `}
          onError={() => setImageError(true)}
          {...props}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            h-3 w-3 rounded-full border-2 border-white
            ${statusStyles[status]}
          `}
          aria-label={status}
        />
      )}
    </span>
  );
}

export default Avatar;
