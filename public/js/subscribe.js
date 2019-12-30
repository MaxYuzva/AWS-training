var formData = new FormData();

function postData(url, data) {
	console.log(JSON.stringify(data));
    return fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
  	.then((data) => {console.log(data)});
}


document.getElementById('subscribe_button').addEventListener('click', function(e){
	e.preventDefault();
	e.stopPropagation();
	subscribe(document.getElementById("email").value);
	return false;
});

document.getElementById('unsubscribe_button').addEventListener('click', function(e){
	e.preventDefault();
	e.stopPropagation();
	unsubscribe(document.getElementById("email").value);
	return false;
});

function subscribe(email) {
	postData('/subscribe', {email: email});
};

function unsubscribe(email) {
	postData('/unsubscribe', {email: email});
};