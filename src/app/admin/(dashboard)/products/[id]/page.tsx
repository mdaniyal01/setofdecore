import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-xl font-medium">Edit Product</h1>
      <div className="mt-6">
        <ProductForm productId={params.id} />
      </div>
    </div>
  );
}
