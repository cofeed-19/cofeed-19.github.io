import { useState, ChangeEvent, FormEvent } from "react";

export interface Props {
  onSubmit: (newFeed: string) => void;
}

export function NewFeedForm({ onSubmit }: Props) {
  const [newFeed, setNewFeed] = useState("");

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setNewFeed(e.target.value);
  }

  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(newFeed);
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input
        placeholder="https://strdr4605.github.io/rss.xml,"
        type="text"
        size={50}
        value={newFeed}
        onChange={onInputChange}
      />
      <button type="submit">Add feed</button>
    </form>
  );
}
