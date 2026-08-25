export interface Review {
  id: string
  authorName: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

export interface ProductReviews {
  averageRating: number
  reviewCount: number
  reviews: Review[]
}

export interface CreateReviewRequest {
  rating: number
  title: string
  comment: string
}
