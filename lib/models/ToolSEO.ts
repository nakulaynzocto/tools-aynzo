import mongoose, { Document, Schema } from 'mongoose';

export interface IToolSEO extends Document {
  toolSlug: string;
  locale: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  pageH1?: string;
  contentBody?: string;
  faq?: { question: string; answer: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const ToolSEOSchema: Schema = new Schema(
  {
    toolSlug: { type: String, required: true },
    locale: { type: String, required: true },
    seoTitle: { type: String, required: true },
    seoDescription: { type: String, required: true },
    seoKeywords: { type: [String], default: [] },
    pageH1: { type: String },
    contentBody: { type: String },
    faq: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one unique entry per tool per locale
ToolSEOSchema.index({ toolSlug: 1, locale: 1 }, { unique: true });

// Add index to optimize dashboard list query
ToolSEOSchema.index({ locale: 1, toolSlug: 1 });

export default mongoose.models.ToolSEO || mongoose.model<IToolSEO>('ToolSEO', ToolSEOSchema);
