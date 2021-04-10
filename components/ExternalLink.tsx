export interface Props {
  link: string;
  title?: string;
  onClick?: () => void;
}

export function ExternalLink({ title, link, onClick }: Props) {
  return (
      <a
        href={link}
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
      >
        {title || link}
      </a>
  );
}
