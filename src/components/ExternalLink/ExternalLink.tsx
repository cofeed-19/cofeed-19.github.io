import { MouseEvent } from "react";
import Styles from "./ExternalLink.module.css";

export type Props = {
  link: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ExternalLink({ title, link, onClick }: Props) {
  return (
    <a
      className={Styles.link}
      href={link}
      rel="noopener"
      target="_blank"
      onClick={onClick}
    >
      {title || link}
    </a>
  );
}
