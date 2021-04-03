export interface Props {
  title: string;
  link: string;
  onClick: () => void;
}

export function PostLink({ title, link, onClick }: Props) {
  return (
    <div>
      <a
        href={link}
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
      >
        {title}
      </a>
    </div>
  );
}
