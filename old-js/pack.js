((n, w, d) => {



    // Putting Superbook object in global namespace.
    if (typeof(w.Bookiza) === 'undefined') {
        w.Bookiza = {
            init({ node, settings }) {
                _initializeSuperBook({ node, settings })
                return new Superbook()
            }
        }
    }




})(navigator, window, document)

console.log('2', this.exists)