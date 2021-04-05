export function Header() {
  return (
    <header>
      <h1>Free web feed</h1>
      <p>No backend! All your feeds are stored in browser!</p>
      <p style={{ color: "red" }}>
        Because we do cross-origin requests most of web feeds are blocked by
        CORS policy😢.
      </p>
      <details>
        <summary>Usage</summary>
        <div>
          <ul>
            <li>
              Should work with any <u>https://[some name].github.io</u> site
              which has web feed (rss or atom).
            </li>
            <li>
              Try <u>http</u> and <u>https</u>.
            </li>
            <li>If it's a personal blog, maybe ask the owner to enable CORS</li>
          </ul>
        </div>
      </details>
      <hr />
    </header>
  );
}
