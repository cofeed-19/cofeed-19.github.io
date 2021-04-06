export function Footer() {
  return (
    <footer>
      <hr />© {new Date().getFullYear()}{" "}
      <a
        href="https://github.com/strdr4605"
        rel="noopener noreferrer"
        target="_blank"
      >
        @strdr4605
      </a>
      . Try <code>https://strdr4605.github.io/rss.xml</code> as your first web
      feed. <br />
      <a
        href="https://github.com/cofeed-19/cofeed-19.github.io"
        rel="noopener noreferrer"
        target="_blank"
      >
        source code
      </a>
    </footer>
  );
}
