"use client";
import { useEffect, useState } from "react";
import { Book } from "@/types/type";
import { FileUpload } from "@/components/ui/file-upload";
import { Save, Check, ChevronsUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Flag from "react-world-flags";
import { languages } from "@/lib/languages";
import toast, { Toaster } from "react-hot-toast";
import { ClassNames } from "@emotion/react";
import { useUser } from "@clerk/nextjs"

const categories = [
  { code: 0, name: "" },
  { code: 1, name: "Science Fiction" },
  { code: 2, name: "Historical Fiction" },
  { code: 3, name: "Biography" },
  { code: 4, name: "Fantasy" },
  { code: 5, name: "Romance" },
  { code: 6, name: "Mystery" },
  { code: 7, name: "Thriller" },
  { code: 8, name: "Self-Help" },
  { code: 9, name: "Children's Literature" },
  { code: 10, name: "Young Adult" },
  { code: 11, name: "Non-Fiction" },
];

export default function AddBookPage(
  { className }
    : { className?: string }
) {
  const { user } = useUser()
  const [image, setImage] = useState<File | null>(null);
  const [formData, setFormData] = useState<Book>({
    idBook: "",
    title: "",
    author: "",
    rating: 0,
    price: 0,
    description: "",
    publisher: "",
    publishDate: "",
    pages: 0,
    language: "",
    imageUrl: "",
    isValid: `${user?.publicMetadata?.isAdmin ? "approved" : "pending"}`,
    stock: 1,
    category: "",
    issold: false,
    idUser: user?.id || "",
    reports: [],
  });

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setImage(files[0]);
      setFormData((prevData) => ({
        ...prevData,
        imageUrl: files[0].name,
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      publishDate: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding book...");

    console.log("Form submitted:", JSON.stringify(formData, null, 2));

    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof Book];
      formDataToSend.append(key, value !== undefined ? String(value) : "");
    });

    if (image) {
      formDataToSend.append("image", image);
    }
    console.log("user in addbook>>", user)

    try {
      const res = await fetch("http://localhost:3000/api/books", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const savedBook = await res.json();
      console.log("Book saved:", JSON.stringify(savedBook, null, 2));
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="text-green-500" />
          <span>Book "{formData.title}" added successfully!</span>
        </div>,
        {
          id: loadingToast,
          duration: 4000,
        }
      );

      setFormData({
        idBook: "",
        title: "",
        author: "",
        rating: 0,
        price: 0,
        description: "",
        publisher: "",
        publishDate: "",
        pages: 0,
        language: "",
        imageUrl: "",
        isValid: "pending",
        stock: 1,
        category: "",
        issold: false,
        idUser: "",
      });
      setImage(null);
    } catch (error) {
      toast.error("Failed to add book", {
        id: loadingToast,
      });
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={cn("p-8 flex flex-col gap-y-2 mt-20 w-[80%] mx-auto", className)}>
      <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
      <p className="text-gray-600 mb-4">Add a new book to your inventory.</p>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <form
        className="flex flex-row w-full justify-between gap-x-2"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col w-2/3 space-y-4">
          <Card className="grid grid-cols-2 gap-4 p-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="author">Author</Label>
              <Input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                type="text"
                id="price"
                name="price"
                min={0}
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="rating">Rating</Label>
              <Input
                type="number"
                id="rating"
                name="rating"
                min={0}
                max={5}
                value={formData.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="publishDate">Publish date</Label>
              <Input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleManualDateChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="pages">Pages</Label>
              <Input
                type="text"
                id="pages"
                name="pages"
                value={formData.pages}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="text"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="language">Language</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.language || "Select Language..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandGroup>
                        {languages.map(({ name, code }) => (
                          <CommandItem
                            key={code}
                            value={name}
                            onSelect={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                language: name,
                              }));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.language === name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <Flag
                              code={code}
                              style={{ width: "20px", height: "15px" }}
                            />
                            <span className="ml-2">{name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.category || "Select Category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandGroup>
                        {categories.map(({ code, name }) => (
                          <CommandItem
                            key={code}
                            value={name}
                            onSelect={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                category: name as Book["category"],
                              }));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.category === name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />

                            <span className="ml-2">{name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <Button variant="default" type="submit" className="col-span-2">
              <Save size={24} /> Save
            </Button>
          </Card>
        </div>

        <div className="w-1/3 min-h-96 border border-dashed bg-white p-4">
          <FileUpload onChange={handleFileUpload} />
          {image && <p className="mt-2">File uploaded: {image.name}</p>}
        </div>
      </form>
    </div>
  );
}
