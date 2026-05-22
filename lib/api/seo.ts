import connectToDatabase from '@/lib/db';
import ToolSEO from '@/lib/models/ToolSEO';

export const fetchDynamicSEO = async (locale: string, slug: string) => {
  try {
    await connectToDatabase();
    const seoData = await ToolSEO.findOne({ toolSlug: slug, locale }).lean();
    return seoData;
  } catch (error) {
    console.error(`Failed to fetch dynamic SEO for ${slug} (${locale})`, error);
    return null;
  }
};
