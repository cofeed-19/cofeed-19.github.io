export function Header() {
  return (
    <header>
      <h1>
        <span>C</span>lient-<span>o</span>nly <span>Feed</span> Reader
      </h1>
      <p>
        No backend! All your feeds are stored in this browser!
        <a
          className="github-button"
          href="https://github.com/cofeed-19/cofeed-19.github.io"
          data-icon="octicon-star"
          data-show-count="true"
          aria-label="Star cofeed-19/cofeed-19.github.io on GitHub"
        >
          Star
        </a>
      </p>

      <details>
        <summary>Usage</summary>
        <ul>
          <li style={{ color: "red" }}>
            Because we do cross-origin requests some web feeds are blocked by
            CORS policy😢. For now we use a free CORS proxy as a fallback, but
            don't rely on it.
          </li>
          <li>Supports RSS and Atom feeds.</li>
          <li>
            Try <u>http</u> and <u>https</u>.
          </li>
          <li>If it's a personal blog, maybe ask the owner to enable CORS</li>
        </ul>
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
            </ul>
          </div>
        </details>
      </details>
      <hr />
    </header>
  );
}
