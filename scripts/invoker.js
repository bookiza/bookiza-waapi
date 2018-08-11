const options = { duration: 300, peel: true, zoom: true, startPage: 1, length: 60 }

// document.addEventListener('DOMContentLoaded', (event) => { console.log('First') })

const superbook = Bookiza.init({ options })

// document.addEventListener('DOMContentLoaded', (event) => { console.log('Third') })

// console.log('invoker', superbook.execute('dimensions'))

// console.log('invoker', superbook.execute('length'))

// console.log('invoker', superbook.execute('view'))

// console.log('invoker', superbook.execute('mode'))

// console.log('invoker', superbook.execute('page'))

// console.log('invoker', superbook.execute('hasPage', 18)) True/False





// console.log(superbook.is('turning', (e)=>{ console.log(e)}))

superbook.on('turned', (event, page)=>{ console.log('yay')})




// window.addEventListener('ready', (event) => { console.log(event) }, false)

// document.getElementById('book').addEventListener('ready', (event) => { console.log(event) }, false)
