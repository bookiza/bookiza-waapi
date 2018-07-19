((n, w, d) => {
    /************************************
     ************* Public API ***********
     ***********************************/

    class Book {
        constructor() {
				this.node = d.getElementById('book')
				this.delegator = d.getElementById('plotter')
                this.state = {
                    'isInitialized': false,
                    'direction': 'forward',
                    'isFlipping': false,
                    'isPeelable': false,
                    'isZoomed': false,
                    'isPeeled': false,
                    'toTurnOrNotToTurn': false,
                    'eventsCache': [],
                    'mode': _viewer.getMatch('(orientation: landscape)') ? 'landscape' : 'portrait'
                }
                this.plotter = {
                    'origin': {
                        "x": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().width) / 2}`,
                        "y": `${parseInt(d.getElementsByTagName('body')[0].getBoundingClientRect().height) / 2}`
                    }
				}
				this.plotter.bounds = _setGeometricalPremise(this.node)
				this.pages = [...this.node.children] // Or source it via http request.
				this.buttons = this.pages.splice(0, 2)	
            }
            // PROPERTIES
        dimensions() {
            return { 'width': `${_book.plotter.bounds.width}`, 'height': `${_book.plotter.bounds.height}` }
        }

        view() {
            return _book.currentViewIndices.map(i => i + 1) // Array of page numbers in the [View].
		}
		
		range() {
			return _book.range
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
     ************* One time init ********
     ************************************/

	const _initializeSuperBook = ({ options = { duration: 300, peel: true, zoom: true, startPage: 1 } }) => {        
		
		_applyEventListenersOnBook(_calculateIndices(options.startPage))

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
                // console.log('Execute half flip')
                break
            case 'DIV':
				// console.log('Page picked, execute curl')
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
                break
            default:
        }
    }

    const _handleMouseClicks = (event) => {
        switch (event.target.nodeName) {
            case 'A':
                break
			case 'DIV':
				console.log(_book.plotter)
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

    /* Don't worry about events below */
    const _handleWheelEvent = (event) => {
        console.log(_book.state.direction)
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
        if (event.touches.length === 2) {}
        console.log(event.touches.length)
    }

    const _handleTouchMove = (event) => {

    }

    const _handleTouchEnd = (event) => {
        console.log('Touch moving')
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


    const _calculateIndices = (currentIndex) => {

		_book.currentPage = _setCurrentPage(currentIndex)
        _book.currentViewIndices = _setViewIndices(_book.currentPage, _book.state.mode)
        _book.range = _setRangeIndices(_book.currentPage, _book.state.mode)

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



    const _updateGeometricalPlotValues = (event) => {
        _book.plotter.side = ((event.pageX - _book.plotter.origin.x) > 0) ? 'right' : 'left'
        _book.plotter.region = ((event.pageY - _book.plotter.origin.y) > 0) ? 'lower' : 'upper'
        _book.plotter.quadrant = _book.plotter.side === 'right' ? (_book.plotter.region === 'upper') ? 'I' : 'IV' : (_book.plotter.region === 'upper') ? 'II' : 'III'
        _book.plotter.currentPointerPosition = JSON.parse(`{ "x": "${event.pageX - _book.plotter.origin.x}", "y": "${_book.plotter.origin.y - event.pageY}" }`)
        _book.plotter.θ = Math.acos(parseInt(_book.plotter.currentPointerPosition.x) * 2 / parseInt(_book.plotter.bounds.width)) // θ in radians
        _book.plotter.μ = parseInt(_book.plotter.currentPointerPosition.x) // x-coord from origin.
		_book.plotter.ε = parseInt(_book.plotter.currentPointerPosition.y) // y-coord from origin.

		_printCursorPosition(event)

		_printGeometricalPremise()


    }

	/* this function can be erased upon release */
    const _printGeometricalPremise = () => {
        d.getElementById('pwidth').textContent = _book.plotter.bounds.width
        d.getElementById('pheight').textContent = _book.plotter.bounds.height
        d.getElementById('ptop').textContent = _book.plotter.bounds.top
        d.getElementById('pleft').textContent = _book.plotter.bounds.left
        d.getElementById('pright').textContent = _book.plotter.bounds.right
        d.getElementById('pbottom').textContent = _book.plotter.bounds.bottom
        // d.getElementById('originX').textContent = _book.plotter.origin.x
        // d.getElementById('originY').textContent = _book.plotter.origin.y
    }
 	/* this function can be erased upon release */
    const _printCursorPosition = (event) => {
        d.getElementById('xaxis').textContent = _book.plotter.μ
        d.getElementById('yaxis').textContent = _book.plotter.ε
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


    if (typeof(w.Bookiza) === 'undefined') {
        w.Bookiza = {
            init({ options }) {
				_initializeSuperBook({ options })
				return new Superbook() // Put Superbook object in global namespace.
            }
        }
    }


})(navigator, window, document)
