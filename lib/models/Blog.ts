import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  slug: string;
  locale: string;
  title: string;
  content: string;
  author: string;
  featuredImage?: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  category?: string;
  toolSlug?: string;
  status?: string;
  readTime?: string;
  internalLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    slug: { type: String, required: true },
    locale: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    featuredImage: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: [String], default: [] },
    category: { type: String },
    toolSlug: { type: String },
    status: { type: String, default: 'published' },
    readTime: { type: String },
    internalLink: { type: String },
  },
  {
    timestamps: true,
  }
);

BlogSchema.index({ slug: 1, locale: 1 }, { unique: true });
BlogSchema.index({ locale: 1, createdAt: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
