const fs = require('fs');
const LANGS = ['hi','ar','ru','de','fr','es','pt','zh','ja','ko','id','tr','it'];
const dir = 'messages';
const NAV = ['tryNow','relatedTools','viewAll','backToTools'];

LANGS.forEach(lang => {
    const d = JSON.parse(fs.readFileSync(dir+'/'+lang+'.json','utf-8'));
    const tools = d.Tools || {};
    const slugs = Object.keys(tools).filter(s => !NAV.includes(s));
    const noTitle = slugs.filter(s => !tools[s].seoTitle).length;
    const noDesc = slugs.filter(s => !tools[s].seoDescription).length;
    const shortDesc = slugs.filter(s => tools[s].seoDescription && tools[s].seoDescription.length < 100).length;
    const withFaq = slugs.filter(s => tools[s].faq).length;
    console.log(lang + ': seoTitle=' + (noTitle === 0 ? 'OK' : 'MISSING:'+noTitle)
        + ' | desc=' + (noDesc === 0 ? 'OK' : 'MISSING:'+noDesc)
        + ' | short=' + (shortDesc === 0 ? 'OK' : 'WARN:'+shortDesc)
        + ' | faq=' + withFaq + '/' + slugs.length);
});
