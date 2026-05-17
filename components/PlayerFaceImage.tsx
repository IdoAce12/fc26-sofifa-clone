"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPlayerImageFallbacks,
  getPlayerImageUrl,
} from "@/lib/playerImage";

const SIZE_MAP = {
  md: "h-12 w-12",
  lg: "h-14 w-14",
  xl: "h-36 w-36 rounded-2xl ring-2 sm:h-40 sm:w-40",
} as const;

type PlayerFaceImageProps = {
  playerId: number;
  name: string;
  size?: keyof typeof SIZE_MAP;
  priority?: boolean;
  className?: string;
};

export function PlayerFaceImage({
  playerId,
  name,
  size = "md",
  priority = false,
  className = "",
}: PlayerFaceImageProps) {
  const sources = useMemo(
    () => [getPlayerImageUrl(playerId), ...getPlayerImageFallbacks()],
    [playerId],
  );
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [playerId]);

  const handleError = useCallback(() => {
    setSourceIndex((current) =>
      current + 1 < sources.length ? current + 1 : current,
    );
  }, [sources.length]);

  const sizeClass = SIZE_MAP[size];
  const frameClass = `${sizeClass} shrink-0 rounded-lg bg-pitch-700 object-cover ring-1 ring-white/10 ${className}`;
  const src = sources[Math.min(sourceIndex, sources.length - 1)];

  return (
    // Native img bypasses Next.js image optimizer — direct CDN load
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={size === "xl" ? 160 : size === "lg" ? 56 : 48}
      height={size === "xl" ? 160 : size === "lg" ? 56 : 48}
      className={frameClass}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}
