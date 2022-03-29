import { useState, ChangeEvent, FormEvent } from "react";
import { siteDomain } from "../constants";
import { importFeed } from "../services/exportService";

type Props = {
  onSubmit: (newFeed: string) => void;
}

export function NewFeedForm({ onSubmit }: Props) {
  const [newFeed, setNewFeed] = useState("");

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    if(input.includes(siteDomain)){
      importFeed(input);
    }else{
      setNewFeed(input);
    }
  }

  function onFormSubmit(e: FormEvent) {
    e.preventDefault();
    newFeed && onSubmit(newFeed);
  }

  return (
    <form onSubmit={onFormSubmit}>
      <input
        placeholder="https://strdr4605.com/feed/rss.xml,http://example.com/atom.xml"
        type="text"
        value={newFeed}
        onChange={onInputChange}
      />
      <button type="submit">Add feeds</button>
    </form>
  );
}
