import React from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from '../components/App'

export default chunks => console.log(chunks)||`<!DOCTYPE html>
${renderToStaticMarkup(
  <html>
    <head><title>App</title></head>
    <body>
      <div id="root" dangerouslySetInnerHTML={{
        __html: renderToString(<App />)
      }} />
      {chunks.main.map((src, key) => (
        <script key={key} src={src} />
      ))}
    </body>
  </html>
)}`;