"use client";
import { notFound } from "next/navigation";
import BookDetailsClient from "../_components/BookDetailsClient";
import { Book } from "@/types/type";
import { useEffect, useState } from "react";


export default function Page({ params }: { params: { id: number } }) {
  const [book, setBook] = useState<Book>();
  const fetchBooks = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/books/${id}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setBook(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };
  useEffect(() => {
    fetchBooks(params.id);
  }, []);
  return book ? <BookDetailsClient book={book} /> : null;
}

// 'use client'
// import React, { useState } from 'react'
// import { books } from '@/data'
// import { Rating } from '@mui/material';
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
// import { ShoppingBag, Heart } from 'lucide-react';
// import { notFound } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import Image from 'next/image';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from '@/components/ui/label';
// import { Book, ReportType } from '@/types/type';
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"
// import { usePathname } from 'next/navigation'
// import { Playfair_Display } from "next/font/google";


// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });



// const page = ({ params }: { params: { id: string } }) => {
//   const { id } = params;
//   console.log("books >>", books)
//   const book = books.find((b) => String(b.idBook) == String(id));
//   console.log("book >>", book)
//   const reportTypes: ReportType[] = [
//     "Inappropriate Content",
//     "Copy Right Issue",
//     "Incorrecte Informations",
//     "Spam",
//     "Other",
//   ];
//   const pathname = usePathname()
//   const [selectedReportType, setSelectedReportType] = useState<string | null>(null);
//   const [newReport, setNewReport] = useState("");
//   const [comments, setComments] = useState<string[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const handleAddComment = () => {
//     if (newComment.trim() !== "") {
//       setComments([...comments, newComment]);
//       setNewComment("");
//     }
//   };
//   if (!book) return notFound();
//   return (
//     <div>
//       <header className="sticky top-0 bg-white z-50 border-b flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
//         <div className="flex items-baseline gap-2 w-[90%] mx-auto">
//           <h1
//             className={`hidden sm:flex items-center justify-center space-x-2 text-2xl font-bold text-center mr-10 ${playfair.className
//               } ${pathname === "/"
//                 ? "text-gray-100 selection:bg-indigo-700/[0.2] selection:text-indigo-500"
//                 : "text-black selection:bg-blue-100 selection:text-blue-500"
//               }`}
//           >
//             Pagina & Espresso
//           </h1>
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem className="hidden md:block">
//                 <BreadcrumbLink href="/library">
//                   Library
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator className="hidden md:block" />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>
//                   Book Details
//                 </BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </header >

//       <div className="mx-auto p-4 w-[80%] pt-20">
//         <div className="flex flex-col md:flex-row gap-6">
//           <Image
//             src={book.imageUrl}
//             alt={`${book.title} cover`}
//             width={200}
//             height={300}
//             className="rounded-lg shadow-lg"
//           />


//           <div className="flex flex-col gap-4 w-full">
//             <div>
//               <h1 className="text-3xl font-bold">{book.title}</h1>
//               <p className="text-gray-700">by {book.author}</p>
//             </div>

//             <Rating name="read-only" value={book.rating} readOnly />

//             <div className="text-xl font-semibold">${book.price.toFixed(2)}</div>

//             <div className="flex flex-wrap gap-4">
//               <Button className="flex gap-2">
//                 <ShoppingBag size={20} /> Add to cart
//               </Button>
//               <Button variant="outline" className="flex gap-2">
//                 <Heart size={20} /> Add to wishlist
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8">
//           <Accordion type="multiple" className="w-full">
//             {book.description && (
//               <AccordionItem value="description">
//                 <AccordionTrigger className="text-xl">
//                   Description
//                 </AccordionTrigger>
//                 <AccordionContent className="text-base">
//                   {book.description}
//                 </AccordionContent>
//               </AccordionItem>
//             )}

//             <AccordionItem value="details">
//               <AccordionTrigger className="text-xl">
//                 More details
//               </AccordionTrigger>
//               <AccordionContent className='text-base'>
//                 <div className="grid grid-cols-2 gap-2 text-gray-700">
//                   {book.publisher && (
//                     <>
//                       <span className="font-semibold">Publisher:</span>
//                       <span>{book.publisher}</span>
//                     </>
//                   )}
//                   <>
//                     <span className="font-semibold">Publish Date:</span>
//                     <span>
//                       {typeof book.publishDate === 'string'
//                         ? new Date(book.publishDate).toLocaleDateString('en-US', {
//                           day: 'numeric',
//                           month: 'long',
//                           year: 'numeric',
//                         })
//                         : 'Unknown publish day'}
//                     </span>
//                   </>
//                   <>
//                     <span className="font-semibold">Pages:</span>
//                     <span>{book.pages ? book.pages : 'Unknown pages'}</span>
//                   </>
//                   {book.language && (
//                     <>
//                       <span className="font-semibold">Language:</span>
//                       <span>{book.language}</span>
//                     </>
//                   )}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//             <AccordionItem value="report">
//               <AccordionTrigger className="text-xl">
//                 warning
//                 Report an issue with this book
//               </AccordionTrigger>
//               <AccordionContent className='text-base'>
//                 <RadioGroup
//                   value={selectedReportType || ""}
//                   onValueChange={setSelectedReportType}
//                   className="space-y-3"
//                 >
//                   {reportTypes.map((reportType) => (
//                     <div className='flex flex-col items-start space-y-2'>
//                       <div
//                         key={reportType}
//                         className="flex items-center space-x-3 p-1"
//                       >
//                         <RadioGroupItem value={reportType} />
//                         <Label className="flex-1 cursor-pointer" htmlFor={reportType}>
//                           <div className="flex justify-between items-center">
//                             <div className="">
//                               <p className="font-medium">{reportType}</p>
//                             </div>
//                           </div>
//                         </Label>
//                       </div>
//                       <div className='w-full'>
//                         {selectedReportType === "Other" && reportType === "Other" && (
//                           <textarea
//                             className="w-full p-3 border rounded-md"
//                             rows={4}
//                             placeholder="Write your report here..."
//                             value={newReport}
//                             onChange={(e) => setNewReport(e.target.value)}
//                           />
//                         )}
//                       </div>


//                     </div>
//                   ))}
//                 </RadioGroup>
//                 <Button className='mt-3' variant={'destructive'} onClick={() => alert(`Reported: ${selectedReportType === 'Other' ? newReport : selectedReportType}`)}>
//                   Report
//                 </Button>
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>

//         <div className="mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
//           <h2 className="text-xl font-bold mb-4">Add a Comment</h2>

//           <textarea
//             className="w-full p-3 border rounded-md"
//             rows={4}
//             placeholder="Write your comment here..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//           />

//           <Button className="mt-3" onClick={handleAddComment}>
//             Submit Comment
//           </Button>

//           <div className="mt-6">
//             <h3 className="text-xl font-semibold mb-2">Comments</h3>
//             {comments.length > 0 ? (
//               <ul className="space-y-2">
//                 {comments.map((comment, index) => (
//                   <li key={index} className="bg-white p-3 rounded-md shadow">
//                     {comment}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-100">
//                 No comments yet. Be the first to comment!
//               </p>
//             )}
//           </div>
//         </div>
//       </div >
//     </div >
//   )
// }

// export default page
