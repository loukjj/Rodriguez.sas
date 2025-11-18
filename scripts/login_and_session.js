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
    // now fetch session
    r = await fetch(base + '/api/auth/session', { headers: { 'Cookie': cookieHeader() } })
    const sess = await r.text()
    console.log('session endpoint status', r.status)
    console.log(sess)
  }catch(e){ console.error('ERR', e.message); process.exit(1) }
})();
