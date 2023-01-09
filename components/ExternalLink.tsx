import { MouseEvent } from 'react';

export interface Props {
  link: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ExternalLink({ title, link, onClick }: Props) {
  return (
      <a
        href={link}
        rel="noopener"
        target="_blank"
        onClick={onClick}
      >
        {title || link}
      </a>
  );
}
