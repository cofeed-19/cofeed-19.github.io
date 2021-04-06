import Head from "next/head";

export function HeadMeta() {
  return (
    <Head>
      <title>Client-only Feed Reader</title>
      <meta
        name="description"
        content="Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"
      />

      <meta property="og:title" content="Client-only Feed Reader" />
      <meta property="og:image" content="/banner.jpg" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />
      <meta
        property="og:description"
        content="Client-only Free Web Feed Reader, No account, No registration, No tracking, Minimalist, Open source"
      />
      <meta property="og:url" content="https://cofeed-19.github.io/" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="https://cofeed-19.github.io/" />
      <meta name="twitter:creator" content="@strdr4605" />

      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
}
