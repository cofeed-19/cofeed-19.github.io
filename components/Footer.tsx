import Styles from "../styles/Footer.module.css";

export function Footer() {
  return (
    <footer className={Styles.footer}>
      <hr />© {new Date().getFullYear()}{" "}
      <a
        href="https://github.com/strdr4605"
        rel="noopener noreferrer"
        target="_blank"
      >
        @strdr4605
      </a>
      . Try <code>https://strdr4605.com/feed/rss.xml</code> as your first web
      feed.
    </footer>
  );
}
