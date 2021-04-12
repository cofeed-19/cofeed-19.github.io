import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { setDarkMode, setLightMode } from "../utils";
import { ExternalLink } from "./ExternalLink";

export function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function onDarkModeChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setIsDarkMode(true);
      setDarkMode();
      localStorage.setItem("dark-mode", "true");
    } else {
      setIsDarkMode(false);
      setLightMode();
      localStorage.removeItem("dark-mode");
    }
  }

  useEffect(() => {
    const isDarkMode = localStorage.getItem("dark-mode");
    if (isDarkMode) {
      setDarkMode();
      setIsDarkMode(true);
    }
  }, []);

  return (
    <header>
      <Link href="/">
        <h1>
          <span>C</span>lient-<span>o</span>nly <span>Feed</span> Reader
        </h1>
      </Link>
      <p>
        No backend! All your feeds are stored in this browser!
        <iframe
          src="https://ghbtns.com/github-btn.html?user=cofeed-19&repo=cofeed-19.github.io&type=star&count=true"
          frameBorder="0"
          scrolling="0"
          width="110"
          height="20"
          title="GitHub"
        ></iframe>
      </p>
      <details>
        <summary>Usage</summary>
        <ul>
          <li style={{ color: "red" }}>
            Because we do cross-origin requests some web feeds are blocked by
            CORS policy😢.
          </li>
          <li>Supports RSS and Atom feeds.</li>
          <li>
            Try <u>http</u> and <u>https</u>.
          </li>
          <li>
            If it's a personal blog, maybe ask the owner to{" "}
            <ExternalLink
              link={"https://enable-cors.org/server.html"}
              title={"enable CORS"}
            />
          </li>
          <li>
            <Link href="/feeds">Feeds added by users</Link>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={onDarkModeChange}
              />
              Dark mode
            </label>
          </li>
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
