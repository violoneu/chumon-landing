import { renderToStaticMarkup } from 'react-dom/server'
import App from './App'
import { products } from './products'
import pages from './pages.json'

const origin = 'https://chumon.ca'
export const routes = Object.entries(pages).flatMap(([page, pair]) =>
  Object.entries(pair).map(([lang, info]) => ({ page, lang, ...info })))
const org = {'@type':'Organization','@id':origin+'/#studio',name:'Chumon',legalName:'9507-5503 QuÃ©bec inc.',url:origin+'/',email:'support@chumon.ca',logo:origin+'/chumon_c.svg',areaServed:'QuÃ©bec'}
export function render(template, pathname) {
  const route = routes.find(r => r.path === pathname)
  const lang = route?.lang ?? (pathname.startsWith('/en/')?'en':'fr')
  const page = route?.page ?? 'missing'
  const locale = lang+'-CA'
  const title = route?.title ?? (lang==='en'?'Page not found | Chumon':'Page introuvable | Chumon')
  const url = origin+pathname
  const graph = [org]
  if (page==='home') graph.push({'@type':'WebSite',name:'Chumon',url:origin+'/',inLanguage:['fr-CA','en-CA'],publisher:{'@id':org['@id']}})
  if (route && page!=='home') graph.push({'@type':'BreadcrumbList',itemListElement:[pages.home[lang],route].map((r,i)=>({'@type':'ListItem',position:i+1,name:r.label,item:origin+r.path}))})
  if (page==='work') graph.push(...products.map(p=>({'@type':'SoftwareApplication',name:p.name,url:p.url,description:p[lang],applicationCategory:'BusinessApplication'})))
  const head = <><title>{title}</title>{route ? <><meta name="description" content={route.description}/><link rel="canonical" href={url}/>{['fr','en','x-default'].map(l=><link key={l} rel="alternate" hrefLang={l==='x-default'?l:l+'-CA'} href={origin+pages[page][l==='x-default'?'fr':l].path}/>)}<meta property="og:title" content={title}/><meta property="og:description" content={route.description}/><meta property="og:url" content={url}/><meta property="og:locale" content={lang+'_CA'}/><meta property="og:site_name" content="Chumon"/><meta property="og:type" content="website"/><meta property="og:image" content={origin+'/og.jpg'}/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:image" content={origin+'/og.jpg'}/></>:<meta name="robots" content="noindex"/>}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}}/></>
  return template.replace('lang="fr-CA"','lang="'+locale+'"').replace('<!--page-head-->',()=>renderToStaticMarkup(head)).replace('<!--page-body-->',()=>renderToStaticMarkup(<App page={page} lang={lang}/>))
}
export function sitemap() {
  const lastmod='2026-11-12'
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'+routes.map(r=>'<url><loc>'+origin+r.path+'</loc><lastmod>'+lastmod+'</lastmod>'+['fr','en','x-default'].map(l=>'<xhtml:link rel="alternate" hreflang="'+(l==='x-default'?l:l+'-CA')+'" href="'+origin+pages[r.page][l==='x-default'?'fr':l].path+'"/>').join('')+'</url>').join('\n')+'</urlset>'
}
