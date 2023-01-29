import { MouseEvent } from "react";
import Styles from "../styles/ExternalLink.module.css";

export interface Props {
  link: string;
  title?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export function ExternalLink({ title, link, onClick }: Props) {
  return (
    // eslint-disable-next-line react/jsx-no-target-blank
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
