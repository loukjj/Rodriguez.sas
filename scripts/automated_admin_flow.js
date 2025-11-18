(async ()=>{
  const fs = await import('fs/promises')
  const path = await import('path')
  const base = 'http://127.0.0.1:3000'
  const email = 'admin.real@local.test'
  const password = 'Str0ngP@ssw0rd!'

  const jar = {}
  function setCookiesFromHeader(h) {
    if (!h) return
    // h may be single string or array
    const arr = Array.isArray(h) ? h : [h]
    for (const item of arr) {
      const parts = item.split(';')[0].split('=')
      const name = parts.shift().trim()
      const value = parts.join('=')
      jar[name] = value
    }
  }
  function cookieHeader() { return Object.entries(jar).map(([k,v])=>`${k}=${v}`).join('; ') }

  try{
    console.log('1) Get CSRF token')
    let r = await fetch(base + '/api/auth/csrf')
    setCookiesFromHeader(r.headers.get('set-cookie'))
    const j = await r.json()
    const csrf = j.csrfToken
    console.log(' csrf:', csrf)

    console.log('2) POST credentials callback (login)')
    const params = new URLSearchParams({ csrfToken: csrf, email, password, json: 'true' })
    r = await fetch(base + '/api/auth/callback/credentials', { method: 'POST', body: params, headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookieHeader() } , redirect: 'manual' })
    setCookiesFromHeader(r.headers.get('set-cookie'))
    const txt = await r.text()
    console.log(' login status:', r.status)

    if (r.status !== 200 && r.status !== 302) {
      console.log('Login failed, response body:', txt)
      process.exit(1)
    }

    console.log('3) Download sample image to public/uploads')
    const imgRes = await fetch('https://picsum.photos/400')
    const buf = Buffer.from(await imgRes.arrayBuffer())
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })
    const outPath = path.join(uploadsDir, 'admin-avatar.jpg')
    await fs.writeFile(outPath, buf)
    console.log(' wrote:', outPath)

    console.log('4) Get users to find our admin id')
    r = await fetch(base + '/api/admin/users', { headers: { 'Cookie': cookieHeader() } })
    if (r.status !== 200) { console.log('failed to list users', r.status); process.exit(1) }
    const users = await r.json()
    const me = users.find(u => u.email === email)
    if (!me) { console.log('admin user not found in users list'); process.exit(1) }
    console.log(' found user id:', me.id)

    console.log('5) Update user image via PUT')
    r = await fetch(base + `/api/admin/users/${me.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Cookie': cookieHeader() }, body: JSON.stringify({ imageUrl: '/uploads/admin-avatar.jpg' }) })
    console.log(' update status:', r.status)
    const upj = await r.json()
    console.log(' update response:', upj)

    console.log('6) Done. Visit http://localhost:3000/admin to verify avatar.')
  } catch (e) {
    console.error('ERR', e)
    process.exit(1)
  }
})();
