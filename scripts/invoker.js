
const lastPage = () => window.localStorage.lastPage || 1

const options = {
	duration: 1000,
	peel: true,
	zoom: false,
	startPage: lastPage(),
	length: 6720,
	build: 'biblical-6720',
	animation: 'hard'
}

// document.addEventListener('DOMContentLoaded', (event) => { console.log('First') })

const superbook = Bookiza.init({ options })

// document.addEventListener('DOMContentLoaded', (event) => { console.log('Third') })

// console.log('invoker', superbook.execute('dimensions'))

// console.log('invoker', superbook.execute('length'))

// console.log('invoker', superbook.execute('view'))

// console.log('invoker', superbook.execute('mode'))

// console.log('invoker', superbook.execute('page'))

// console.log('invoker', superbook.execute('hasPage', 18)) True/False

/* Events */
// superbook.on('turning', (event) => { console.log(event) })

// superbook.on('turned', (event) => { console.log(event, event.page, event.view) })
