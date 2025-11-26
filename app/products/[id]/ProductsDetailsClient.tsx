"use client";
import { CarouselPlugin } from "@/components/CarouselPlugin";
import { Spinner } from "@/components/ui/spinner";
import { fetchProductById } from "@/lib/queries";
import { useCartStore } from "@/store/cartStore";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  RotateCcw,
  ShoppingCart,
  Star,
  StarHalf,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export default function ProductDetails({ id }: { id: number }) {
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
  });

  const cartItems = useCartStore((state) => state.items);
  const addToCart = useCartStore((state) => state.addItem);
  const removeFromCart = useCartStore((state) => state.removeItem);

  const inCart = cartItems.some((cart) => cart.id == id);
  console.log("incart", inCart);

  const cartItem = cartItems.find((cart) => cart.id == id);

  if (isLoading) {
    return <Spinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="w-5 h-5 fill-yellow-500 text-yellow-500"
        />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-muted" />);
    }
    return stars;
  };

  const handleAddToCart = () => {
    addToCart({ id: product.id }, quantity);
    setIsEditing(false);
    setQuantity(1);
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleQuantityChange = (value: number, stock: number) => {
    const clampValue = Math.max(1, Math.min(value, stock));
    setQuantity(clampValue);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Image Slider Section */}
          <div className="relative">
            <div className="relative h-[500px] flex items-center justify-center">
              <CarouselPlugin images={product.images} />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              {/* Heading for the Product*/}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-primary uppercase tracking-wide">
                  {product.brand}
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">
                  {product.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium text-foreground">
                  {product.rating}
                </span>
                <span className="text-muted-foreground">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {product.tags?.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ${discountedPrice}
              </span>
              <span className="text-2xl text-muted-foreground line-through">
                ${product.price}
              </span>
              <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-semibold">
                Save {product.discountPercentage.toFixed(0)}%
              </span>
            </div>

            {/* Stock and SKU */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-600">
                  {product.availabilityStatus}
                </span>
                <span className="text-muted-foreground">
                  ({product.stock} in stock)
                </span>
              </div>
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>

            {/* Cart Controls */}
            {inCart && (
              <div className="w-full bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center justify-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">
                  In Cart: {cartItem?.quantity} item(s)
                </span>
              </div>
            )}

            {isEditing ? (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-foreground">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        Number(e.target.value),
                        product.stock
                      )
                    }
                    onClick={(e) => e.preventDefault()}
                    className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary text-center font-semibold"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleAddToCart();
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Package className="w-5 h-5" />
                    Confirm
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : inCart ? (
              <div className="w-full flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  Edit Quantity
                </button>
                <button
                  onClick={() => {
                    removeFromCart(product.id);
                    setIsEditing(false);
                    toast.success("Removed from cart successfully");
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Remove
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 gap-4 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Shipping</p>
                  <p className="text-muted-foreground text-sm">
                    {product.shippingInformation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Returns</p>
                  <p className="text-muted-foreground text-sm">
                    {product.returnPolicy}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-foreground">Warranty</p>
                  <p className="text-muted-foreground text-sm">
                    {product.warrantyInformation}
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            {product.dimensions && (
              <div className="pt-4">
                <p className="font-semibold text-foreground mb-2">Dimensions</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>W: {product.dimensions.width}cm</span>
                  <span>H: {product.dimensions.height}cm</span>
                  <span>D: {product.dimensions.depth}cm</span>
                  <span>Weight: {product.weight}g</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Customer Reviews
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {product.reviews.map((review: Review, idx: number) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-foreground mb-4">{review.comment}</p>
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">
                      {review.reviewerName}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
