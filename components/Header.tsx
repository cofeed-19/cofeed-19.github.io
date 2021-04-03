export function Header() {
  return (
    <header>
      <h1>Free web feed</h1>
      <p>No backend! All your feeds are stored in browser!</p>
      <p style={{ color: "red" }}>
        Because we do cross-origin requests most of web feeds are blocked by CORS
        policy😢.
      </p>
      <hr />
    </header>
  );
}
