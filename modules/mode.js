// module.exports mode = () => {
//     getMatch(query, usePolyfill) {
//         return this.testMedia(query, usePolyfill).matches
//     },

//     onChange(query, cb, usePolyfill) {
//         const res = this.testMedia(query, usePolyfill)

//         res.addListener(changed => {
//             cb.apply({}, [changed.matches, changed.media])
//         })
//     },

//     testMedia(query, usePolyfill) {
//         const isMatchMediaSupported = !!(w && w.matchMedia) && !usePolyfill

//         if (isMatchMediaSupported) {
//             const res = w.matchMedia(query)
//             return res
//         } else {
//             // ... add polyfill here or use polyfill.io for IE8 and below
//         }
//     }
// }
