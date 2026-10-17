import {
  Package,
  ShoppingBag,
  UsersRound,
  Wallet,
} from "lucide-react";

export const dashboardStats = [
  {
    label: "Total revenue",
    value: "$2,480.00",
    change: "+12.8%",
    note: "vs last week",
    icon: Wallet,
    tone: "green",
  },
  {
    label: "Total orders",
    value: "186",
    change: "+8.2%",
    note: "vs last week",
    icon: ShoppingBag,
    tone: "blue",
  },
  {
    label: "Products",
    value: "48",
    change: "+4 new",
    note: "this month",
    icon: Package,
    tone: "amber",
  },
  {
    label: "Customers",
    value: "312",
    change: "+16.4%",
    note: "vs last week",
    icon: UsersRound,
    tone: "purple",
  },
];

export const salesData = {
  week: {
    label: "This week",
    total: "$2,480.00",
    change: "12.8%",
    bars: [
      { day: "Mon", height: 41 },
      { day: "Tue", height: 65 },
      { day: "Wed", height: 51 },
      { day: "Thu", height: 78 },
      { day: "Fri", height: 94 },
      { day: "Sat", height: 59 },
      { day: "Sun", height: 72 },
    ],
  },
  month: {
    label: "This month",
    total: "$9,860.00",
    change: "18.4%",
    bars: [
      { day: "Wk 1", height: 48 },
      { day: "Wk 2", height: 68 },
      { day: "Wk 3", height: 56 },
      { day: "Wk 4", height: 92 },
    ],
  },
  year: {
    label: "This year",
    total: "$84,320.00",
    change: "9.6%",
    bars: [
      { day: "Jan", height: 55 },
      { day: "Feb", height: 44 },
      { day: "Mar", height: 70 },
      { day: "Apr", height: 63 },
      { day: "May", height: 85 },
      { day: "Jun", height: 95 },
    ],
  },
};

export const products = [
  { name: "Fresh fruit cup", category: "Fresh snacks", price: "$3.50", stock: 24, icon: "🍓", color: "bg-rose-50", status: "Active" },
  { name: "Cheese sandwich", category: "Lunch favourites", price: "$5.00", stock: 18, icon: "🥪", color: "bg-amber-50", status: "Active" },
  { name: "Apple juice", category: "Drinks", price: "$2.00", stock: 7, icon: "🧃", color: "bg-sky-50", status: "Low stock" },
  { name: "Chocolate biscuit", category: "Treats", price: "$1.50", stock: 32, icon: "🍪", color: "bg-orange-50", status: "Active" },
];

export const orders = [
  { id: "#SC-2084", customer: "Amelia Johnson", initials: "AJ", items: 3, date: "Today, 10:42 AM", total: "$18.50", status: "Ready" },
  { id: "#SC-2083", customer: "Noah Williams", initials: "NW", items: 2, date: "Today, 10:36 AM", total: "$12.00", status: "Preparing" },
  { id: "#SC-2082", customer: "Olivia Brown", initials: "OB", items: 5, date: "Today, 10:18 AM", total: "$24.75", status: "Preparing" },
  { id: "#SC-2081", customer: "Liam Davis", initials: "LD", items: 1, date: "Today, 9:54 AM", total: "$6.50", status: "Complete" },
];

export const customers = [
  { name: "Amelia Johnson", email: "amelia.j@school.edu", orders: 18, spent: "$124.50", initials: "AJ" },
  { name: "Noah Williams", email: "noah.w@school.edu", orders: 14, spent: "$98.00", initials: "NW" },
  { name: "Olivia Brown", email: "olivia.b@school.edu", orders: 11, spent: "$87.25", initials: "OB" },
  { name: "Liam Davis", email: "liam.d@school.edu", orders: 9, spent: "$62.00", initials: "LD" },
];

export const categories = [
  { name: "Fresh snacks", products: 12, color: "bg-rose-50 text-rose-700" },
  { name: "Drinks", products: 9, color: "bg-sky-50 text-sky-700" },
  { name: "Lunch favourites", products: 14, color: "bg-amber-50 text-amber-800" },
  { name: "Treats", products: 8, color: "bg-orange-50 text-orange-700" },
  { name: "Stationery", products: 5, color: "bg-violet-50 text-violet-700" },
];
