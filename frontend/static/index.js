let URL = "http://127.0.0.1:8000/api/task-list/"
let ul = document.querySelector('#listUl')
let activeItem = null

buildList()

function buildList(){
	
	ul.innerHTML = ''

	fetch(URL)
		.then(res=> res.json())
		.then(data=>{
			let list = data

			for (let i in list ){
				let listItem = `
								<li class="list-group-item d-flex justify-content-between align-items-center">
									${list[i].title}
									<span>
										<button class="btn btn-sm btn-warning editBtn">Edit</button>
										<button class="btn btn-sm btn-danger deleteBtn">Delete</button>
									</span>
								</li>
								`
				ul.innerHTML += listItem
			}


			for (let i in list ){
				let editBtn = document.getElementsByClassName("editBtn")[i]
				let deleteBtn = document.getElementsByClassName("deleteBtn")[i]

				editBtn.addEventListener('click',function(){
					editItem(list[i])
				})


				deleteBtn.addEventListener('click',function(){
					deleteItem(list[i])
				})

			}
			
		})
		
}

// This is From Django Documentation 
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken') //This Var is for csrf token in django 


let form = document.querySelector('#form')
form.addEventListener('submit', createItem)

function createItem(e) {
	e.preventDefault()

	
	let URL = "http://127.0.0.1:8000/api/task-create/"

	// Here This two line code is use for reuse fetch for update thats mean put request
	if (activeItem != null){
		URL = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
		activeItem = null
	}

	let title = document.querySelector('#title').value
	fetch(URL, {
		method:'POST',
		headers:{
			'content-type':'application/json',
			'X-CSRFToken':csrftoken,
		},
		body:JSON.stringify({'title':title})
	})
	.then(res=> {
		buildList()
		document.querySelector('#form').reset()
	})

}


function editItem(item){
	activeItem = item
	document.querySelector('#title').value = activeItem.title
}

function deleteItem(item){
	console.log('delete clicked')
	let URL = `http://127.0.0.1:8000/api/task-delete/${item.id}/`
	fetch(URL, {
		method:'DELETE',
		headers:{
			'content-type':'application/json',
			'X-CSRFToken':csrftoken,
		},

	})
	.then(res=> {
		buildList()
	})
}