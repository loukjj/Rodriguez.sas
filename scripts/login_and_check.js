(async ()=>{
  const base = 'http://127.0.0.1:3000'
  const email = 'admin.real@local.test'
  const password = 'Str0ngP@ssw0rd!'
  const jar = {}
  function setCookiesFromHeader(h){ if(!h) return; const arr=Array.isArray(h)?h:[h]; for(const item of arr){ const parts=item.split(';')[0].split('='); const name=parts.shift().trim(); const value=parts.join('='); jar[name]=value }}
  function cookieHeader(){ return Object.entries(jar).map(([k,v])=>`${k}=${v}`).join('; ') }
  try{
    let r = await fetch(base + '/api/auth/csrf')
    setCookiesFromHeader(r.headers.get('set-cookie'))
    const j = await r.json()
    const csrf = j.csrfToken
    const params = new URLSearchParams({ csrfToken: csrf, email, password, json: 'true' })
    r = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader() }, redirect: 'manual' })
    setCookiesFromHeader(r.headers.get('set-cookie'))
    console.log('login status', r.status)
    if (r.status !== 200 && r.status !== 302) { console.log('login failed'); process.exit(1) }
    // now fetch /products with cookie header
    r = await fetch(base + '/products', { headers: { 'Cookie': cookieHeader() } })
    const txt = await r.text()
    console.log('products status', r.status)
    const checks = ['Bienvenido a la tienda','Pasa el cursor','Carrito','Añadir','Admin','Iniciar sesión','Cerrar sesión']
    for(const c of checks) console.log(c, txt.includes(c))
    const idx = txt.indexOf('Bienvenido a la tienda')
    if(idx!==-1) console.log('---BANNER_SNIPPET---\n', txt.slice(Math.max(0, idx-200), idx+500))
  }catch(e){ console.error('ERR', e.message); process.exit(1) }
})();
