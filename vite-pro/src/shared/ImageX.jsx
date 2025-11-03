import { useMemo, useState } from 'react'

function fallbackDataURI({ w = 900, h = 600, label = '' }) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2a3550"/><stop offset="100%" stop-color="#0e1625"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w*0.18}" cy="${h*0.32}" r="${Math.min(w,h)*0.09}" fill="rgba(255,255,255,.12)"/>
    <rect x="${w*0.34}" y="${h*0.26}" rx="12" width="${w*0.5}" height="${h*0.34}" fill="rgba(255,255,255,.08)"/>
    <text x="50%" y="${h-18}" text-anchor="middle" font-family="system-ui,Segoe UI,Arial" font-size="16" fill="rgba(255,255,255,.75)">${label}</text>
  </svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

export default function ImageX({ src, alt = '', width = 900, height = 600, className, style }) {
  const [ok, setOk] = useState(true)
  const fallback = useMemo(() => fallbackDataURI({ w: width, h: height, label: alt }), [width, height, alt])
  const imgSrc = ok ? src : fallback
  return (
    <span className={'imgx' + (className ? ' ' + className : '')} style={{ display:'block', position:'relative', overflow:'hidden', ...style }}>
      <img src={imgSrc} alt={alt} width={width} height={height} loading="lazy" decoding="async"
           onError={() => setOk(false)} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
      <i className="imgx-skel" aria-hidden />
    </span>
  )
}