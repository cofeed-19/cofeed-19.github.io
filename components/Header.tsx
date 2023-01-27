import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { ExportImportForm } from "./ExportImportForm";
import { setDarkMode, setLightMode } from "../utils";
import { ExternalLink } from "./ExternalLink";
import Styles from "../styles/Header.module.css";

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
      localStorage.setItem("dark-mode", "false");
    }
  }

  useEffect(() => {
    const isDarkMode =
      (!localStorage.getItem("dark-mode") &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
      localStorage.getItem("dark-mode") === "true";
    if (isDarkMode) {
      setDarkMode();
      setIsDarkMode(true);
    }
  }, []);

  return (
    <header className={Styles.header}>
      <Link href="/">
        <h1>
          <span>C</span>lient-<span>o</span>nly <span>Feed</span> Reader
        </h1>
      </Link>
      <div className={Styles.iframeContainer}>
        No backend! All your feeds are stored in this browser!
        <iframe
          src="https://ghbtns.com/github-btn.html?user=cofeed-19&repo=cofeed-19.github.io&type=star&count=true"
          title="GitHub"
        />
      </div>
      <details className={Styles.details}>
        <summary>Usage</summary>
        <ul className={Styles.usage}>
          <li>
            Because we do cross-origin requests some web feeds are blocked by
            CORS policy😢. But you can install{" "}
            <a href="https://mybrowseraddon.com/access-control-allow-origin.html">
              a browser extension that allow CORS
            </a>
            😊.
          </li>
          <li>Supports RSS and Atom feeds</li>
          <li>
            Try <u>http</u> and <u>https</u>
          </li>
          <li>
            If it&apos;s a personal blog, maybe ask the owner to{" "}
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
        <details className={Styles.details}>
          <summary>Why to use?</summary>
          <div>
            <ul>
              <li>It&apos;s Free</li>
              <li>No account</li>
              <li>No tracking</li>
              <li>Minimalist</li>
              <li>Open source</li>
            </ul>
          </div>
        </details>
        <details className={Styles.details}>
          <summary>Why NOT to use?</summary>
          <div>
            <ul>
              <li>CORS issue</li>
              <li>No sync with other devices</li>
              <li>Minimalist</li>
            </ul>
          </div>
        </details>
        <ExportImportForm />
      </details>
      <hr />
    </header>
  );
}
