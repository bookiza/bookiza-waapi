self.addEventListener('message', event => {

	console.log(event.data)

	// Send the message back.
	self.postMessage('You said: ' + event.data);
  }, false)
