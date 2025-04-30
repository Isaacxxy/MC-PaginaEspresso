"use client"
import React, { useEffect, useState } from 'react'
import CarouselUi from './_components/Carousel'
import { imagesCarousel } from '@/data'
import { books } from '@/data'
import BookCarousel from './_components/BookCarousel'
import SearchAutocomplete from '@/components/search'
import { Book } from '@/types/type'

const page = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchBooks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/books");

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setBooks(data.slice(0, 10));
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };
  useEffect(() => {
    fetchBooks();
  }, []);
  return (
    <div className='space-y-20'>
      <SearchAutocomplete data={books} />
      <CarouselUi images={imagesCarousel} />
      <BookCarousel books={books} />
    </div>
  )
}

export default page