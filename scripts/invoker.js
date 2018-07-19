const options = { duration: 600, peel: true, zoom: true, startPage: 11 }

const superbook = Bookiza.init({ options })

console.log(superbook.execute('dimensions'))

console.log(superbook.execute('length'))

console.log(superbook.execute('view'))

// console.log(superbook.execute('range'))

console.log(superbook.execute('mode'))