"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
};

export function SimulatedTypingEffect({ text, speed = 12 }: Props) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);
    const interval = setInterval(() => {
      setVisibleChars((current) => {
        if (current >= text.length) {
          clearInterval(interval);
          return current;
        }
        return current + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="whitespace-pre-line">{text.slice(0, visibleChars)}</p>;
}
