import pages from './src/pages.json'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile, mkdir, cp } from 'node:fs/promises'
import path from 'node:path'

export default defineConfig({
  appType:'mpa',
  build: { copyPublicDir: false },
  plugins:[react(), {
    name:'chumon-pages',
    configureServer(server) {
      server.middlewares.use(async(req,res,next)=>{
        const url = new URL(req.url,'http://localhost')
        if (url.pathname !== '/sitemap.xml' && (/\.[^/]+$/.test(url.pathname) || url.pathname.startsWith('/@'))) return next()
        try {
          const {routes,render,sitemap} = await server.ssrLoadModule('/src/render.jsx')
          if (url.pathname==='/sitemap.xml') { res.setHeader('Content-Type','application/xml'); res.end(sitemap()); return }
          const template = await server.transformIndexHtml(url.pathname, await readFile('index.html','utf8'))
          res.statusCode = routes.some(r=>r.path===url.pathname)?200:404
          res.setHeader('Content-Type','text/html; charset=utf-8')
          res.end(render(template,url.pathname))
        } catch (err) { next(err) }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req,res,next)=>{
        const pathname = new URL(req.url, 'http://localhost').pathname
        if (pathname === '/' || pathname.includes('.')) return next()
        const clean = pathname.replace(/\/$/,'')
        const match = Object.values(pages).some(pair=>Object.values(pair).some(r=>r.path===clean))
        if (match && clean !== pathname) {
          res.writeHead(301,{Location:clean+new URL(req.url,'http://localhost').search})
          return res.end()
        }
        const file = match ? clean : (pathname.startsWith('/en/')?'/en/404':'/404')
        try {
          const html = await readFile('dist'+file+'.html')
          res.writeHead(match?200:404,{'Content-Type':'text/html; charset=utf-8'})
          res.end(html)
        } catch(err) { next(err) }
      })
    },
    async closeBundle() {
      if (this.environment?.config.command !== 'build') return
      const {createServer} = await import('vite')
      const server = await createServer({configFile:false,plugins:[react()],server:{middlewareMode:true,hmr:false},appType:'custom'})
      try {
        const {routes,render,sitemap} = await server.ssrLoadModule('/src/render.jsx')
        const template = await readFile('dist/index.html','utf8')
        for (const r of [...routes,{path:'/404'},{path:'/en/404'}]) {
          const file = 'dist'+(r.path==='/'?'/index':r.path)+'.html'
          await mkdir(path.dirname(file),{recursive:true})
          await writeFile(file,render(template,r.path))
        }
        for (const name of ['logo_blanc.svg','chumon_c.svg','robots.txt','og.jpg','media']) {
          await cp('public/'+name,'dist/'+name,{recursive:true})
        }
        await writeFile('dist/sitemap.xml',sitemap())
      } finally { await server.close() }
    },
  }]
})

