export type Drink = {
  id: number;
  name: string;
  category:
    | "Latte"
    | "Espresso Specialties"
    | "Black coffee"
    | "Hot & Iced Chocolates"
    | "Refreshas"
    | "Coffee Frappuccino"
    | "Cream Frappuccino"
    | "Teavana - Milk Tea"
    | "Teavana - Iced Tea"
    | "Teavana - Hot Teas"
    | "Waters & Juices";
  description: string;
  ingredients: string[];
  sizes: {
    small?: {
      price: number;
      stock: number;
      sugarContent?: number;
      points: number;
    };
    medium?: {
      price: number;
      stock: number;
      sugarContent?: number;
      points: number;
    };
    large?: {
      price: number;
      stock: number;
      sugarContent?: number;
      points: number;
    };
  };
  imageUrl: string;
  temperature: "hot" | "cold";
  rating?: number;
};

export type Row = {
  id: string;
  name: string;
};

export type Coupon = {
  id: string;
  title: string;
  pointsRequired: number;
  discount: number;
  status: string;
  barcode: string;
  bgTop: string;
  bgBottom: string;
};

export type RowProp = {
  row: Row;
  coupons: Coupon[];
};

export type CouponCardProp = {
  coupon: Coupon;
};

export type User = {
  points: number;
  wallet: Coupon[];
  cart: CartItem[];
};

export type ImagesCarousel = {
  id: string;
  url: string;
  alt: string;
};

export type CartItem =
  | {
      itemType: "book";
      book: Book;
      quantity: number;
    }
  | {
      itemType: "drink";
      drink: Drink;
      size: keyof Drink["sizes"];
      quantity: number;
    };

export type BookStatus = "pending" | "rejected" | "approved" | "out of stock";

export interface Book {
  idBook: string;
  title: string;
  author: string;
  imageWidth?: number;
  imageHeight?: number;
  imageUrl: string;
  rating: number;
  price: number;
  stock: number;
  description: string;
  publisher: string;
  publishDate: string;
  pages: number;
  language: string;
  isValid: BookStatus;
  category:
    | ""
    | "Science Fiction"
    | "Historical Fiction"
    | "Biography"
    | "Fantasy"
    | "Romance"
    | "Mystery"
    | "Thriller"
    | "Self-Help"
    | "Children's Literature"
    | "Young Adult"
    | "Non-Fiction";
  issold: boolean;
  reviews?: { user: string; comment: string }[];
  idUser: string;
  reports?: Report[];
}

export type ReportType =
  | ""
  | "Inappropriate Content"
  | "Copy Right Issue"
  | "Incorrecte Informations"
  | "Spam"
  | "Other";

export type Report = {
  id: number;
  idBook: number;
  type: ReportType;
  timestamp: Date;
  Content: string;
};
