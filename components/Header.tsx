export function Header() {
  return (
    <header>
      <h1>Client-only Feed Reader</h1>
      <p>No backend! All your feeds are stored in this browser!</p>
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
              which has web feed (RSS/Atom).
            </li>
            <li>
              Try <u>http</u> and <u>https</u>.
            </li>
            <li>If it's a personal blog, maybe ask the owner to enable CORS</li>
          </ul>
        </div>
        <details>
          <summary>Why to use?</summary>
          <div>
            <ul>
              <li>It's Free</li>
              <li>No account</li>
              <li>No tracking</li>
              <li>Minimalist</li>
              <li>Open source</li>
            </ul>
          </div>
        </details>
        <details>
          <summary>Why NOT to use?</summary>
          <div>
            <ul>
              <li>CORS issue</li>
              <li>No sync with other devices</li>
              <li>Minimalist</li>
              <li>Stupid?</li>
            </ul>
          </div>
        </details>
      </details>
      <hr />
    </header>
  );
}
