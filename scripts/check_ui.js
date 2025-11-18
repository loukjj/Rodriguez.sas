(async ()=>{
  const url = 'http://127.0.0.1:3000/products'
  try{
    const res = await fetch(url)
    const txt = await res.text()
    console.log('status', res.status)
    const checks = ['Bienvenido a la tienda','Pasa el cursor','Carrito','Añadir','Admin','Iniciar sesión','Cerrar sesión']
    for(const c of checks){
      console.log(c, txt.includes(c))
    }
    // also show a small cleaned snippet containing the banner area
    const idx = txt.indexOf('Bienvenido a la tienda')
    if(idx!==-1){
      console.log('---BANNER_SNIPPET---')
      console.log(txt.slice(Math.max(0, idx-200), idx+500))
    }
  }catch(e){ console.error('ERR', e.message) }
})()
