import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { Category, BookStatus } from "@prisma/client";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      where: {
        isValid: "APPROVED",
        stock: {
          gt: 0,
        },
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

//OK
const saveImage = async (file: File) => {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, file.name);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  await fs.promises.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  return `/uploads/${file.name}`;
};

//OK
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const rating = formData.get("rating") as string;
    const price = formData.get("price") as string;
    const publisher = formData.get("publisher") as string;
    const publishDate = formData.get("publishDate") as string;
    const pages = formData.get("pages") as string;
    const language = formData.get("language") as string;
    const isValid = formData.get("isValid") as string;
    const stock = formData.get("stock") as string;
    const imageFile = formData.get("image") as File;
    const category = formData.get("category") as string;
    const issold = formData.get("issold") === "true";
    const idUser = formData.get("idUser") as string;
    console.log("idUser in formdata >>", idUser);

    const categoryMap: { [key: string]: Category } = {
      "Science Fiction": Category.SCIENCE_FICTION,
      "Historical Fiction": Category.HISTORICAL_FICTION,
      Biography: Category.BIOGRAPHY,
      Fantasy: Category.FANTASY,
      Romance: Category.ROMANCE,
      Mystery: Category.MYSTERY,
      Thriller: Category.THRILLER,
      "Self-Help": Category.SELF_HELP,
      "Children's Literature": Category.CHILDRENS_LITERATURE,
      "Young Adult": Category.YOUNG_ADULT,
      "Non-Fiction": Category.NON_FICTION,
    };

    const mappedCategory = categoryMap[category] ?? Category.SCIENCE_FICTION;

    const imageUrl = await saveImage(imageFile);

    const newBook = await prisma.book.create({
      data: {
        title: title.toUpperCase(),
        author: author.toUpperCase(),
        rating: Number(rating),
        price: Number(price),
        description: description.toUpperCase(),
        publisher: publisher.toUpperCase(),
        publishDate: publishDate,
        pages: Number(pages),
        language: language.toUpperCase(),
        imageUrl: imageUrl,
        isValid: isValid.toUpperCase() as BookStatus,
        stock: Number(stock),
        category: mappedCategory,
        issold: Boolean(issold),
        idUser: idUser,
      },
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Failed to create book:", error);
    return NextResponse.json(
      { message: "Error creating book", error },
      { status: 500 }
    );
  }
}
