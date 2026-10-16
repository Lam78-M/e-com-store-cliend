import ProductsManager from "@/components/admin/ProductsManager";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : "";
  return <ProductsManager initialCategory={category} />;
}
