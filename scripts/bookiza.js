((n, w, d) => {
    /************************************
     ************* Public API ***********
     ***********************************/
	class Book {
		constructor() {
			this.node = d.getElementById('book')
			this.delegator = d.getElementById('plotter')
			this.state = {
				'direction': 'forward',
				'isInitialized': false,
				// 'isTurning': false,
				// 'isPeelable': false,
				// 'isZoomed': false,
				// 'isPeeled': false,
				// 'toTurnOrNotToTurn': false,
				// 'eventsCache': [],
				'mode': _viewer.getMatch('(orientation: landscape)') ? 'landscape' : 'portrait'
			}
			/* @plotter.origin is set at the center of the viewport,
			*  thus splitting the screen into four quadrants instead
			*  of the default IV-quadrant referencing used in
			*  scroll animation mechanics.
			*/
			this.plotter = {
				'origin': {
					"x": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().width) / 2}`,
					"y": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().height) / 2}`
				}
			}
			this.plotter.bounds = _setGeometricalPremise(this.node)
			this.pages = [...this.node.children] // Source via http request. Or construct via React/JSX like template transformation.
			this.buttons = this.pages.splice(0, 2)
			this.frames = this.pages.map((page, index) => _addPageWrappersAndBaseClasses(page, index)) // Frame is a page with necessary wrappers and shadow elements | or pseudo before: :after elements.
		}
		// PROPERTIES
		dimensions() {
			return { 'width': `${_book.plotter.bounds.width}`, 'height': `${_book.plotter.bounds.height}` }
		}

		view() {
			return _book.currentViewIndices.map(i => i + 1) // Array of page numbers in the [View].
		}

		page() {
			return _book.currentPage
		}

		getLength() {
			return _book.pages.length
		}

		getMode() {
			return _book.state.mode
		}
	}


	/************************************
     ******** Geometry listeners ********
     ************************************/

	const _setGeometricalPremise = (node) => node.getBoundingClientRect()

	const _resetGeometricalPremise = () => { _book.plotter.bounds = _setGeometricalPremise(_book.node) }

	w.addEventListener('resize', _resetGeometricalPremise) // Recalibrate geometrical premise.

	const _setGeometricalOrigin = () => ({
		"x": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().width) / 2}`,
		"y": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().height) / 2}`
	})

	const _resetGeometricalOrigin = () => { _book.plotter.origin = _setGeometricalOrigin() }

	w.addEventListener('resize', _resetGeometricalOrigin) // Re-calibrate geometrical origin.

	/************************************
     *********** One time init **********
     ************************************/

	const _initializeSuperBook = ({ options = { duration: 300, peel: true, zoom: true, startPage: 1 } }) => {
		_removeChildren(_book.node)

		_book.options = options // Save new or default settings

		_applyEventListenersOnBook(_calculateIndices(options.startPage)) // Event delegation via #plotter node.


		// const worker = new Worker('../workers/base.js')

		// worker.addEventListener('message', (event) => {
		// 	console.log(event.data) // Log the workers message.
		//   }, false)

		// worker.postMessage('Hello World')
		/* Initailization is complete */

		_book.state.isInitialized = true

		_printBookToDOM() // Go for the first print.
	}

	const handler = (event) => {
		if (!event.target) return

		event.stopPropagation()
		event.preventDefault()

		switch (event.type) {
			case 'mouseover':
				_handleMouseOver(event)
				break
			case 'mouseout':
				_handleMouseOut(event)
				break
			case 'mousemove':
				_handleMouseMove(event)
				break
			case 'mousedown':
				_handleMouseDown(event)
				break
			case 'mouseup':
				_handleMouseUp(event)
				break
			case 'click':
				_handleMouseClicks(event)
				break
			case 'dblclick':
				_handleMouseDoubleClick(event)
				break
			case 'wheel':
				_handleWheelEvent(event)
				break
			case 'keydown':
				_handleKeyDownEvent(event)
				break
			case 'keypress':
				_handleKeyPressEvent(event)
				break
			case 'keyup':
				_handleKeyUpEvent(event)
				break
			case 'touchstart':
				_handleTouchStart(event)
				break
			case 'touchmove':
				_handleTouchMove(event)
				break
			case 'touchend':
				_handleTouchEnd(event)
				break
			default:
				console.log(event) // Ignore all other events.
				break
		}
	}

	const mouseEvents = ['mousemove', 'mouseover', 'mousedown', 'mouseup', 'mouseout', 'click', 'dblclick', 'wheel']

	const touchEvents = ['touchstart', 'touchend', 'touchmove']

	const keyEvents = ['keypress', 'keyup', 'keydown']

	const _applyEventListenersOnBook = (callback) => {
		keyEvents.forEach(event => {
			w.addEventListener(event, handler)
		})

		const _applyBookEvents = () => {
			mouseEvents.map(event => {
				_book.delegator.addEventListener(event, handler)
			})
		}

		const _removeBookEvents = () => {
			mouseEvents.map(event => {
				_book.delegator.removeEventListener(event, handler)
			})
		}

		w.addEventListener('mouseover', _applyBookEvents)
		w.addEventListener('mouseout', _removeBookEvents)

		/* Touch capability is used only to apply eventListeners pertaining to touch.  */
		if (isTouch()) {
			touchEvents.map(event => {
				_book.delegator.addEventListener(event, handler)
			})
		}

		if (callback && typeof callback === 'function') callback()
	}

	/****************************************/
	/************* Event handlers ***********/
	/****************************************/

	const _handleMouseOver = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				_book.state.direction = _setFlippingDirection()

				break
			case 'DIV':
				break
			default:
				break
		}
	}

	const _handleMouseOut = (event) => {
		// TODO: This is where we calculate range pages according to QI-QIV.

	}

	const _handleMouseMove = (event) => {
		_updateGeometricalPlotValues(event)
	}

	const _handleMouseDown = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				console.log('Execute half curl over')
				break
			case 'DIV':
				// console.log('Page picked, execute curl')
				// console.log('down', event.pageX)
				break
			default:
		}
	}

	const _handleMouseUp = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				console.log('Complete the flip')
				break
			case 'DIV':
				// console.log('up', event.pageX)
				break
			default:
		}
	}

	const _handleMouseClicks = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				_book.state.direction = (event.target.id) === 'next' ? 'forward' : 'backward'

				_animateLeaf()

				break
			case 'DIV':
				break
			default:
		}
	}


	const _handleMouseDoubleClick = (event) => {
		switch (event.target.nodeName) {
			case 'A':

				break
			case 'DIV':
				break
			default:
		}
	}

	const _handleWheelEvent = (event) => {
		switch (event.target.nodeName) {
			case 'A':
				_book.state.direction = (event.deltaY < 0) ? 'backward' : 'forward'

				console.log(_book.state.direction)

				break
			case 'DIV':
				break
			default:
		}

	}

	const _handleKeyPressEvent = (event) => {
		console.log('pressed', event.keyCode)
	}

	const _handleKeyDownEvent = (event) => {
		console.log('down', event.keyCode)
	}

	const _handleKeyUpEvent = (event) => {
		console.log('up', event.keyCode)
	}

	const _handleTouchStart = (event) => {
		if (event.touches.length === 2) {

		}
		console.log(event.touches.length)
	}

	const _handleTouchMove = (event) => {
		_updateGeometricalPlotValues(event)
	}

	const _handleTouchEnd = (event) => {
		console.log('Touch moving')
	}

	/**********************************/
	/******** Animation methods *******/
	/**********************************/


	const _keyframes = () => [
		{ transform: 'rotateY(0deg)', transformOrigin: '0 50% 0', },
		{ transform: 'rotateY(180deg)', transformOrigin: '0 50% 0', }
	]

	const _options = ({ duration = _book.options.duration, bezierCurvature = 'ease-out' }) => ({
		duration: duration,
		easing: bezierCurvature,
		fill: 'forwards'
	})


	const _animateLeaf = () => {
		let animation = _book.frames[_book.currentViewIndices[1]].animate(_keyframes(), _options({}))

		console.log(animation.playState)

		animation.onfinish = function (event) {
			_book.frames[_book.currentViewIndices[1]].remove()
			console.log(animation.playState)
		}

	}

	/**********************************/
	/********** Helper methods ********/
	/**********************************/

	const isTouch = () => (('ontouchstart' in w) || (n.MaxTouchPoints > 0) || (n.msMaxTouchPoints > 0))

	const isEven = number => number === parseFloat(number) ? !(number % 2) : void 0

	const isOdd = number => Math.abs(number % 2) === 1

	const sign = x => typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 1 : NaN : NaN

	const _leftCircularIndex = (currentIndex, index) => (parseInt(currentIndex) - parseInt(index) < 0) ? parseInt(_book.pages.length) + (parseInt(currentIndex) - parseInt(index)) : (parseInt(currentIndex) - parseInt(index))

	const _rightCircularIndex = (currentIndex, index) => (parseInt(currentIndex) + parseInt(index) >= parseInt(_book.pages.length)) ? (parseInt(currentIndex) + parseInt(index)) - parseInt(_book.pages.length) : (parseInt(currentIndex) + parseInt(index))

	const _stepper = (mode) => (mode === 'portrait') ? 1 : 2

	const π = Math.PI

	const _radians = degrees => degrees / 180 * π

	const _degrees = radians => radians / π * 180

	const Δ = (displacement) => { } // Displacement on mousedown + mousemove/touchstart + touchmove

	const λ = (angle) => { }  // Cone angle

	const _setFlippingDirection = () => (_book.plotter.side === 'right') ? 'forward' : 'backward'

	const _calculateIndices = (currentIndex) => {

		_book.currentPage = _setCurrentPage(currentIndex)
		_book.currentViewIndices = _setViewIndices(_book.currentPage, _book.state.mode)
		_book.range = _setRangeIndices(_book.currentPage, _book.state.mode) // Why range and why not rangeIndices? Why an object? Dang this is dumb.

		console.log(_book.currentPage, _book.currentViewIndices, _book.range)

	}

	const _setCurrentPage = startPage => (startPage === undefined) ? 1 : (parseInt(startPage) > 0 && parseInt(startPage) < parseInt(_book.pages.length)) ? parseInt(startPage) % parseInt(_book.pages.length) : (parseInt(startPage) % parseInt(_book.pages.length) === 0) ? parseInt(_book.pages.length) : parseInt(startPage) < 0 ? parseInt(_book.pages.length) + 1 + parseInt(startPage) % parseInt(_book.pages.length) : parseInt(startPage) % parseInt(_book.pages.length) // Cyclic array

	const _setViewIndices = (currentPage = 1, mode) => {
		let currentIndex = parseInt(currentPage) - 1

		switch (mode) {
			case 'portrait':
				return [currentIndex]
				break
			case 'landscape':
				if (isEven(parseInt(currentPage))) {
                    /***
                    		@range = _book.pages.slice(P , Q) where:
                    				P & Q are integers
                    				P & Q may or may not lie in the range 0 < VALUES < 2N (_book.length)
                    	***/
					let q = (parseInt(currentPage) + 1) > parseInt(_book.pages.length) ? 1 : (parseInt(currentPage) + 1) % parseInt(_book.pages.length)
					return [currentIndex, q - 1]

				} else {
					let p = (parseInt(currentPage) - 1) < 1 ? _book.pages.length : (parseInt(currentPage) - 1) % parseInt(_book.pages.length)
					return [p - 1, currentIndex]
				}
				break
		}
	}

	const _setRangeIndices = (currentPage = 1, mode) => {
		let currentIndex = parseInt(currentPage) - 1

        /***
        	@range = _book.pages.slice(P , Q) where:
        		P, Q, R, S are integers
        		P, Q, R, S may or may not lie in the range 0 < VALUE < 2N (_book.length)
        ***/

		let [p, q, r, s] = [0]

		switch (mode) {
			case 'portrait':
				// let p = (currentIndex - 2 < 0) ? parseInt(_book.pages.length) + (currentIndex - 2) : (currentIndex - 2)
				// let q = (currentIndex - 1 < 0) ? parseInt(_book.pages.length) + (currentIndex - 1) : (currentIndex - 1)
				// let r = (currentIndex + 1 >= parseInt(_book.pages.length)) ? (currentIndex + 1) - parseInt(_book.pages.length) : (currentIndex + 1)
				// let s = (currentIndex + 2 >= parseInt(_book.pages.length)) ? (currentIndex + 2) - parseInt(_book.pages.length) : (currentIndex + 2)
				p = _leftCircularIndex(currentIndex, 2)
				q = _leftCircularIndex(currentIndex, 1)
				r = _rightCircularIndex(currentIndex, 1)
				s = _rightCircularIndex(currentIndex, 2)
				break
			case 'landscape':
				if (isEven(parseInt(currentPage))) {
					// let p = (currentIndex - 2 < 0) ? parseInt(_book.pages.length) + (currentIndex - 2) : (currentIndex - 2)
					// let q = (currentIndex - 1 < 0) ? parseInt(_book.pages.length) + (currentIndex - 1) : (currentIndex - 1)
					// let r = (currentIndex + 2 >= parseInt(_book.pages.length)) ? (currentIndex + 2) - parseInt(_book.pages.length) : (currentIndex + 2)
					// let s = (currentIndex + 3 >= parseInt(_book.pages.length)) ? (currentIndex + 3) - parseInt(_book.pages.length) : (currentIndex + 3)
					p = _leftCircularIndex(currentIndex, 2)
					q = _leftCircularIndex(currentIndex, 1)
					r = _rightCircularIndex(currentIndex, 2)
					s = _rightCircularIndex(currentIndex, 3)
				} else {
					// let p = (currentIndex - 3 < 0) ? parseInt(_book.pages.length) + (currentIndex - 3) : (currentIndex - 3)
					// let q = (currentIndex - 2 < 0) ? parseInt(_book.pages.length) + (currentIndex - 2) : (currentIndex - 2)
					// let r = (currentIndex + 1 >= parseInt(_book.pages.length)) ? currentIndex + 1 - parseInt(_book.pages.length) + 1 : (currentIndex + 1)
					// let s = (currentIndex + 2 >= parseInt(_book.pages.length)) ? currentIndex + 1 - parseInt(_book.pages.length) + 1 : (currentIndex + 2)
					p = _leftCircularIndex(currentIndex, 3)
					q = _leftCircularIndex(currentIndex, 2)
					r = _rightCircularIndex(currentIndex, 1)
					s = _rightCircularIndex(currentIndex, 2)
				}
				break
		}
		return { 'leftPageIndices': [p, q], 'rightPageIndices': [r, s] }
	}

	const _removeChildren = node => { node.innerHTML = '' }

	const _printBookToDOM = () => {
		_printElementsToDOM('buttons', _book.buttons)
		_printElementsToDOM('view', _book.currentViewIndices.map(index => _book.frames[`${index}`]))
		// _printElementsToDOM('rightPages', _book.range.rightPageIndices.map(index => _book.frames[`${index}`]))
		// _printElementsToDOM('leftPages', _book.range.leftPageIndices.map(index => _book.frames[`${index}`]))
	}

	const _printElementsToDOM = (type, elements) => {
		const docfrag = d.createDocumentFragment()
		switch (type) {
			case 'buttons':
				elements.forEach(elem => {
					docfrag.appendChild(elem)
				})
				break
			case 'view':
				let pageList = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type)
				})
				pageList.forEach(page => {
					docfrag.appendChild(page)
				})
				break
			case 'rightPages':
				let rightPages = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type)
				})
				rightPages.forEach(page => {
					docfrag.appendChild(page)
				})
				break
			case 'leftPages':
				let leftPages = elements.map((page, currentIndex) => {
					return _applyStyles(page, currentIndex, type)
				})
				leftPages.forEach(page => {
					docfrag.appendChild(page)
				})
				break
		}
		_book.node.appendChild(docfrag)
	}

	const _applyStyles = (pageObj, currentIndex, type) => {
		let cssString = ''
		switch (_book.state.mode) {
			case 'portrait':
				switch (type) {
					case 'view':
						// inner
						cssString = 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center 0;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'z-index: 2; float: left; left: 0;'
						pageObj.style.cssText = cssString
						break
					case 'rightPages':
						// inner
						cssString = 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center 0; visibility: hidden;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'float: left; left: 0; pointer-events:none; visibility: hidden;'
						cssString += isEven(currentIndex) ? 'z-index: 1; ' : 'z-index: 0;'
						pageObj.style.cssText = cssString
						break
					case 'leftPages':
						// inner
						cssString = 'transform: translate3d(0, 0, 0) rotateY(-90deg) skewY(0deg); transform-origin: 0 center 0; visibility: hidden;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'float: left; left: 0; pointer-events:none; visibility: hidden;'
						cssString += isEven(currentIndex) ? 'z-index: 0; ' : 'z-index: 1;'
						pageObj.style.cssText = cssString
						break
				}
				break
			case 'landscape':
				switch (type) {
					case 'view':
						cssString = isEven(currentIndex) ? 'pointer-events:none; transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 100% center;' : 'pointer-events:none; transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'z-index: 3; pointer-events:none;'
						cssString += isEven(currentIndex) ? 'float: left; left: 0;' : 'float: right; right: 0;'
						pageObj.style = cssString
						break
					case 'rightPages':
						// inner
						cssString = 'pointer-events:none;'
						cssString += isEven(currentIndex) ? 'transform: translate3d(0, 0, 0) rotateY(180deg) skewY(0deg); transform-origin: 100% center; visibility: hidden;' : 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 0 center; visibility: hidden;'
						pageObj.childNodes[0].style = cssString
						// wrapper
						cssString = 'pointer-events:none;'
						cssString += isEven(currentIndex) ? 'z-index: 2; float: left; left: 0; visibility: hidden;' : 'z-index: 1; float: right; right: 0; visibility: hidden;'
						pageObj.style.cssText = cssString
						break
					case 'leftPages':
						// inner
						cssString = 'pointer-events:none;'
						cssString += isEven(currentIndex) ? 'transform: translate3d(0, 0, 0) rotateY(0deg) skewY(0deg); transform-origin: 100% center; visibility: hidden;' : 'transform: translate3d(0, 0, 0) rotateY(-180deg) skewY(0deg); transform-origin: 0 center; visibility: hidden;'
						pageObj.childNodes[0].style = cssString

						// wrapper
						cssString = 'pointer-events:none;'
						pageObj.style.cssText = cssString
						cssString += isEven(currentIndex) ? 'z-index: 1; float: left; left: 0; visibility: hidden;' : 'z-index: 2; float: right; right: 0; visibility: hidden;'
						pageObj.style.cssText = cssString
						break
				}
		}

		return pageObj
	}

	const _addPageWrappersAndBaseClasses = (pageObj, currentIndex) => {
		_removeClassesFromElem(pageObj, 'page')
		let classes = `promoted inner page-${parseInt(currentIndex) + 1}`
		classes += isEven(currentIndex) ? ' odd' : ' even'
		_addClassesToElem(pageObj, classes)
		let wrappedHtml = _wrapHtml(pageObj, currentIndex)
		return wrappedHtml
	}

	const _wrapHtml = (pageObj, currentIndex) => {
		const newWrapper = d.createElement('div')
		let classes = 'wrapper'
		classes += isEven(currentIndex) ? ' odd' : ' even'
		_addClassesToElem(newWrapper, classes)
		newWrapper.setAttribute('id', parseInt(currentIndex) + 1)
		// newWrapper.setAttribute('data-page', parseInt(currentIndex) + 1)
		// Try :before :after pseudo elements instead.
		// newWrapper.innerHTML = `<div class="outer gradient"><h1> View[${parseInt(currentIndex) + 1}]  </h1></div>`
		newWrapper.appendChild(pageObj)
		return newWrapper
	}



	const _updateGeometricalPlotValues = (event) => {
		_book.plotter.side = ((event.pageX - _book.plotter.origin.x) > 0) ? 'right' : 'left'
		_book.plotter.region = ((event.pageY - _book.plotter.origin.y) > 0) ? 'lower' : 'upper'
		_book.plotter.quadrant = _book.plotter.side === 'right' ? (_book.plotter.region === 'upper') ? 'I' : 'IV' : (_book.plotter.region === 'upper') ? 'II' : 'III'
		_book.plotter.currentPointerPosition = JSON.parse(`{ "x": "${event.pageX - _book.plotter.origin.x}", "y": "${_book.plotter.origin.y - event.pageY}" }`)
		_book.plotter.θ = Math.acos(parseInt(_book.plotter.currentPointerPosition.x) * 2 / parseInt(_book.plotter.bounds.width)) // θ in radians
		_book.plotter.μ = parseInt(_book.plotter.currentPointerPosition.x) // x-coord from origin.
		_book.plotter.ε = parseInt(_book.plotter.currentPointerPosition.y) // y-coord from origin.

		// console.log(sign(_book.plotter.μ))

		_printCursorPosition(event) // delete this method call alongwith its function
		_printGeometricalPremise() // delete this method call alongwith its function

	}



	/* this function can be erased upon release */
	const _printGeometricalPremise = () => {
		d.getElementById('pwidth').textContent = _book.plotter.bounds.width
		d.getElementById('pheight').textContent = _book.plotter.bounds.height
		d.getElementById('ptop').textContent = _book.plotter.bounds.top
		d.getElementById('pleft').textContent = _book.plotter.bounds.left
		d.getElementById('pright').textContent = _book.plotter.bounds.right
		d.getElementById('pbottom').textContent = _book.plotter.bounds.bottom
		d.getElementById('originX').textContent = _book.plotter.origin.x
		d.getElementById('originY').textContent = _book.plotter.origin.y
	}

	/* this function can be erased upon release */
	const _printCursorPosition = (event) => {
		d.getElementById('xaxis').textContent = _book.plotter.μ
		d.getElementById('yaxis').textContent = _book.plotter.ε
	}


    /**********************************
    ************* Polyfills ***********
    **********************************/

	DOMTokenList.prototype.addmany = function (classes) {
		let classArr = classes.split(' ')
		for (let i = 0; i < classArr.length; i++) {
			this.add(classArr[i])
		}
	}

	DOMTokenList.prototype.removemany = function (classes) {
		let classArr = classes.split(' ')
		for (let i = 0; i < classArr.length; i++) {
			this.remove(classArr[i])
		}
	}

	const _addClassesToElem = (elem, classes) => {
		elem.classList.addmany(classes)
	}

	const _removeClassesFromElem = (elem, classes) => {
		elem.classList.removemany(classes)
	}

	Number.prototype.between = function (min, max) {
		return this > min && this < max
	}

	Element.prototype.remove = function () {
		this.parentElement.removeChild(this)
	}

	NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
		for (let i = this.length - 1; i >= 0; i--) {
			if (this[i] && this[i].parentElement) {
				this[i].parentElement.removeChild(this[i])
			}
		}
	}


	const _viewer = {
		getMatch(query, usePolyfill) {
			return this.testMedia(query, usePolyfill).matches
		},

		onChange(query, cb, usePolyfill) {
			const res = this.testMedia(query, usePolyfill)

			res.addListener(changed => {
				cb.apply({}, [changed.matches, changed.media])
			})
		},

		testMedia(query, usePolyfill) {
			const isMatchMediaSupported = !!(w && w.matchMedia) && !usePolyfill

			if (isMatchMediaSupported) {
				const res = w.matchMedia(query)
				return res
			} else {
				// ... add polyfill here or use polyfill.io for IE8 and below
			}
		}
	}

	_viewer.onChange('(orientation: landscape)', match => {
		_book.state.mode = match ? 'landscape' : 'portrait'
	})

	let _book = new Book()

	console.log(_book)

	class Superbook {
		execute(methodName, ...theArgs) {
			switch (methodName) {
				case 'length':
					return _book['getLength']()
				case 'mode':
					return _book['getMode']()
				case 'page':
					if (theArgs.length === 0) { return _book['page']() } else { _book['flipPage'](theArgs) }
					break
				default:
					return _book[methodName](theArgs)
			}
		}
	}


	if (typeof (w.Bookiza) === 'undefined') {
		w.Bookiza = {
			init({ options }) {
				_initializeSuperBook({ options })
				return new Superbook() // Put Superbook object in global namespace.
			}
		}
	}


})(navigator, window, document)
