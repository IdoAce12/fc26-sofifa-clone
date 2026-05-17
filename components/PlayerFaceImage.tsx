"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPlayerImageSources,
  PLAYER_IMAGE_PLACEHOLDER,
} from "@/lib/playerImage";

const SIZE_MAP = {
  md: { px: 48, className: "h-12 w-12" },
  lg: { px: 56, className: "h-14 w-14" },
  xl: {
    px: 160,
    className: "h-36 w-36 rounded-2xl ring-2 sm:h-40 sm:w-40",
  },
} as const;

type PlayerFaceImageProps = {
  playerId: number;
  faceUrl?: string | null;
  name: string;
  size?: keyof typeof SIZE_MAP;
  priority?: boolean;
  className?: string;
};

export function PlayerFaceImage({
  playerId,
  faceUrl,
  name,
  size = "md",
  priority = false,
  className = "",
}: PlayerFaceImageProps) {
  const sources = useMemo(
    () => getPlayerImageSources(playerId, faceUrl),
    [playerId, faceUrl],
  );
  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [playerId, faceUrl]);

  const { px, className: sizeClass } = SIZE_MAP[size];
  const frameClass = `${sizeClass} shrink-0 rounded-lg bg-pitch-700 object-cover ring-1 ring-white/10 ${className}`;
  const src = sources[Math.min(sourceIndex, sources.length - 1)] ?? PLAYER_IMAGE_PLACEHOLDER;
  const isPlaceholder = src === PLAYER_IMAGE_PLACEHOLDER;

  const handleError = useCallback(() => {
    setSourceIndex((current) =>
      current + 1 < sources.length ? current + 1 : current,
    );
  }, [sources.length]);

  if (isPlaceholder) {
    return (
      <Image
        src={PLAYER_IMAGE_PLACEHOLDER}
        alt=""
        width={px}
        height={px}
        className={frameClass}
        aria-hidden
      />
    );
  }

  return (
    <Image
      src={src}
      alt={name}
      width={px}
      height={px}
      className={frameClass}
      unoptimized
      priority={priority}
      onError={handleError}
    />
  );
}
