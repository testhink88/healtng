// src/components/common/RatingStars.jsx
import React from "react";
import Icon from "@/components/AppIcon";

const clamp = (n, min, max) => Math.max(min, Math.min(max, n ?? 0));

export default function RatingStars({
  rating = 0,
  size = 14,
  className = "",
}) {
  const r = clamp(rating, 0, 5);
  const full = Math.floor(r);
  const hasHalf = r % 1 !== 0;
  const empty = 5 - Math.ceil(r);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {Array.from({ length: full }).map((_, i) => (
        <Icon key={`full-${i}`} name="Star" size={size} className="text-warning fill-warning" />
      ))}
      {hasHalf && (
        <Icon key="half" name="StarHalf" size={size} className="text-warning fill-warning" />
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Icon key={`empty-${i}`} name="Star" size={size} className="text-muted-foreground" />
      ))}
    </span>
  );
}
