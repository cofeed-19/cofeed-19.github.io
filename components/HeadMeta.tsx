import Head from "next/head";

export function HeadMeta() {
  return (
    <Head>
      <meta charSet="UTF-8"></meta>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
      ></meta>
      <title>Client-only Feed Reader</title>
      <meta
        name="description"
        content="Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"
      />

      <meta property="og:title" content="Client-only Feed Reader" />
      <meta
        property="og:image"
        content="https://cofeed-19.github.io/banner.jpg"
      />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:description"
        content="Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"
      />
      <meta property="og:url" content="https://cofeed-19.github.io/" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="https://cofeed-19.github.io/" />
      <meta name="twitter:creator" content="@strdr4605" />

      <link rel="icon" href="https://cofeed-19.github.io/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="https://cofeed-19.github.io/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="https://cofeed-19.github.io/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="https://cofeed-19.github.io/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#EE802f"></meta>
    </Head>
  );
}
