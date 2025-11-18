(async ()=>{
  const ports=[3000,3001]
  for(const p of ports){
    try{
      const root = `http://127.0.0.1:${p}/`
      const products = `http://127.0.0.1:${p}/products`
      const res = await fetch(root)
      const txt = await res.text()
      console.log('PORT',p,'STATUS',res.status)
      console.log('---SNIPPET-ROOT---')
      console.log(txt.slice(0,1200))
      const res2 = await fetch(products)
      const txt2 = await res2.text()
      console.log('---SNIPPET-PRODUCTS---')
      console.log(txt2.slice(0,1200))
      process.exit(0)
    }catch(e){
      console.error('PORT',p,'ERR',e.message)
    }
  }
  process.exit(1)
})()
