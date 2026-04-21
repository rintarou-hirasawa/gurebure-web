import { useEffect, useMemo, useState } from 'react';
import type { Card } from '../types/card';
import { getCardImageSrc } from '../lib/cardImage';

type CardLike = Pick<Card, 'name' | 'image_url'>;

export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  card: CardLike;
}

/**
 * カード画像。表示候補を順に試し、最後はプレースホルダ SVG。
 */
export function CardImage({ card, alt, onError, ...rest }: CardImageProps) {
  const primary = getCardImageSrc(card);

  const fallbackUrls = useMemo(() => {
    const name = encodeURIComponent(card.name);
    const jpg = `/card_illustrations/${name}.jpg`;
    const png = `/card_illustrations/${name}.png`;
    const list: string[] = [];
    const push = (u: string) => {
      if (u && !list.includes(u)) list.push(u);
    };
    push(primary);
    push(jpg);
    push(png);
    push('/placeholder-card.svg');
    return list;
  }, [primary, card.name]);

  const [attempt, setAttempt] = useState(0);
  const src = fallbackUrls[Math.min(attempt, fallbackUrls.length - 1)];

  useEffect(() => {
    setAttempt(0);
  }, [card.name, card.image_url]);

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setAttempt((a) => {
      if (a >= fallbackUrls.length - 1) {
        onError?.(e);
        return a;
      }
      return a + 1;
    });
  };

  return (
    <img
      src={src}
      alt={alt ?? card.name}
      onError={handleError}
      {...rest}
    />
  );
}
