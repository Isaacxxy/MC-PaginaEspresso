'use client'
import { Book } from "@/types/type"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useRef } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Rating } from "@mui/material"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function BookEditForm({
  book,
  onSave,
  trigger
}: {
  book: Book
  onSave: (updatedBook: Book) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState(book)
  const [rating, setRating] = useState(book.rating)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' || name === 'pages' || name === 'imageWidth' || name === 'imageHeight'
        ? Number(value)
        : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        imageUrl,
        imageWidth: prev.imageWidth || 200,
        imageHeight: prev.imageHeight || 300
      }))
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const loadingToast = toast.loading("Updating book...")
    const isOtherFieldModified = Object.keys(formData).some(key => {
      if (key === 'stock') return false
      if (key === 'rating') return rating !== book.rating
      if (key === 'imageUrl') {
        return formData.imageUrl !== book.imageUrl &&
          !formData.imageUrl.startsWith('blob:')
      }
      return formData[key as keyof Book] !== book[key as keyof Book]
    })

    let newStatus = book.isValid
    if (formData.stock === 0) {
      newStatus = "out of stock"
    } else if (book.stock === 0 && formData.stock > 0) {
      newStatus = "pending"
    } else if (isOtherFieldModified) {
      newStatus = "pending"
    }
    if (!isOtherFieldModified && book.stock === formData.stock) {
      toast.dismiss(loadingToast)
      setOpen(false)
      return
    }
    onSave({
      ...formData,
      rating,
      isValid: newStatus
    })

    setOpen(false)
    toast.success(
      newStatus === "pending"
        ? "Book updated. Status set to pending approval."
        : newStatus === "out of stock"
          ? "Book updated. Status set to out of stock."
          : "Book updated successfully.",
      {
        id: loadingToast,
        duration: 4000,
      }
    )
  }

  const categories = [
    "Science Fiction",
    "Historical Fiction",
    "Biography",
    "Fantasy",
    "Romance",
    "Mystery",
    "Thriller",
    "Self-Help",
    "Children's Literature",
    "Young Adult",
    "Non-Fiction"
  ]

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Colonne gauche */}
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Author</Label>
                  <Input
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Book['category'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Rating</Label>
                  <div className="flex items-center gap-2">
                    <Rating
                      name="rating"
                      value={rating}
                      precision={1}
                      onChange={(_, newValue) => {
                        if (newValue !== null) {
                          setRating(newValue)
                        }
                      }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {rating.toFixed(1)}/5
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Price</Label>
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <Label>Stock</Label>
                  <Input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Book Cover</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-32 border rounded-md overflow-hidden">
                      <img
                        src={formData.imageUrl}
                        alt={formData.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        type="button"
                        onClick={triggerFileInput}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Image Width</Label>
                    <Input
                      name="imageWidth"
                      type="number"
                      value={formData.imageWidth || ''}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label>Image Height</Label>
                    <Input
                      name="imageHeight"
                      type="number"
                      value={formData.imageHeight || ''}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Publisher</Label>
                  <Input
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Publish Date</Label>
                  <Input
                    name="publishDate"
                    type="date"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Pages</Label>
                  <Input
                    name="pages"
                    type="number"
                    value={formData.pages}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label>Language</Label>
                  <Input
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}