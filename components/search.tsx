"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Book } from "@/types/type";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchAutocompleteProps {
  data: Book[];
}

export default function SearchAutocomplete({ data }: SearchAutocompleteProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Book[]>([]);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (suggestion: Book) => {
    setQuery(suggestion.title);
    router.push(`/library/${suggestion.idBook}`);
    setSuggestions([]);
  };

  // Detect outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-[80%] mx-auto mt-20">
      <div className="flex items-center border rounded-full bg-transparent px-3 ">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Search for a book..."
        />
      </div>
      {suggestions.length > 0 ? (
        <ul className="absolute w-full border bg-white rounded-md mt-1 shadow-lg z-10 max-h-[300px] overflow-y-auto overflow-x-hidden">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-8 object-cover rounded"
              />
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
      ) : query.length > 0 && (
        <div className="absolute w-full border bg-white rounded-md mt-1 shadow-lg z-10 max-h-[300px] overflow-y-auto overflow-x-hidden">
          <p className="p-2 text-center text-gray-500">No results found</p>
        </div>
      )}
    </div>
  );
}
