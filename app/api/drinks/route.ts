import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//OK
export async function GET() {
  try {
    const drinks = await prisma.drink.findMany({
      include: {
        sizes: true,
      },
    });

    return NextResponse.json(drinks, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des boissons:", error);
    return NextResponse.json(
      { message: "Erreur serveur lors de la récupération des boissons." },
      { status: 500 }
    );
  }
}
