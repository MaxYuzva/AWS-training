var formData = new FormData();

document.getElementById('submit_button').addEventListener('click', (e)=>{
	e.stopPropagation();
	e.preventDefault();

	console.log(document.getElementById('photo').files[0]);

	formData.append('photo', document.getElementById('photo').files[0]);

	postData('/', formData);

	return false;
});

function postData(url = '/', data = {}) {
    return fetch(url, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
  	.then((data) => {console.log(data)});
}

function render(data){
		document.getElementById('gallery').innerHTML = '';
		let nodes = document.createElement('div');
		
		data.data.forEach((item)=>{
			let node = document.createElement('div');
			node.className = 'image-item__container';	
			node.innerHTML = `<img class="image-item" src="${item.url}">`;
			nodes.append(node);
		});
		document.getElementById('gallery').append(nodes);
}

function renderAll(){
	fetch('/all')
	.then(response=>response.json())
	.then(data=>{
		render(data);
	});
};
renderAll();




function renderByName() {
	fetch(`/${document.getElementById('search_value').value}`)
	.then(response=>response.json())
	.then(data=>{
		render(data);
	});
};

document.getElementById('search_button').addEventListener('click', function(){
	renderByName();
});



function renderRandom() {
	fetch(`/random`)
	.then(response=>response.json())
	.then(data=>{
		render(data);
	});
};

document.getElementById('random_button').addEventListener('click', function(){
	renderRandom();
});