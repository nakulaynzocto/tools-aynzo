const mongoose = require('mongoose');
const { marked } = require('marked');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tools-aynzo';

const S = new mongoose.Schema({
  toolSlug:{type:String,required:true},locale:{type:String,required:true},
  seoTitle:{type:String,required:true},seoDescription:{type:String,required:true},
  seoKeywords:{type:[String],default:[]},pageH1:{type:String},
  contentBody:{type:String},faq:[{question:String,answer:String}]
},{timestamps:true});

const ToolSEO = mongoose.models.ToolSEO || mongoose.model('ToolSEO', S);

async function convert() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for HTML migration');
    
    const docs = await ToolSEO.find({});
    console.log(`📋 Found ${docs.length} tools to check.`);
    
    let convertedCount = 0;
    for (const doc of docs) {
      if (doc.contentBody) {
        const body = doc.contentBody.trim();
        // Check if the content is Markdown (contains markdown characters and does not start with standard HTML tags)
        const isMarkdown = !body.startsWith('<') || body.includes('##') || body.includes('**');
        
        if (isMarkdown) {
          console.log(`🔄 Converting [${doc.locale}] ${doc.toolSlug} from Markdown to clean HTML...`);
          const htmlContent = marked.parse(body);
          
          doc.contentBody = htmlContent;
          await doc.save();
          convertedCount++;
        }
      }
    }
    
    console.log(`\n📊 Migration Done! Successfully converted ${convertedCount} tools to HTML format.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error('❌ Migration Error:', e.message);
    process.exit(1);
  }
}

convert();
