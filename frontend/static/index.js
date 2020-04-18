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



// This Url for Build List
let URL = "http://127.0.0.1:8000/api/task-list/"
let ul = document.querySelector('#listUl')

let activeItem = null
var list_snapshot = []


// ---------------------------------Here We Call buildList Function for Create List in DOM--------------------------------
buildList()

function buildList() {

    // ul.innerHTML = '' // If we do it it will be evrey time re rendering

    fetch(URL)
        .then(res => res.json())
        .then(data => {


            // First Loop Start
            let list = data
            for (let i in list) {

                try {
                    document.getElementById(`data-row-${i}`).remove()
                } catch (err) {
					// Here we don't need to console.log err
                }

                let title = `<span>${list[i].title}</span>`
                if (list[i].completed == true) {
                    title = `<strike>${list[i].title}</strike>`
                }

                let listItem = `
				<li id="data-row-${i}" class="list-group-item d-flex justify-content-between align-items-center">
					<div style="cursor:pointer" class="mainTitle">
					${title}
					</div>
					<span>
						<button class="btn btn-sm btn-warning editBtn">Edit</button>
						<button class="btn btn-sm btn-danger deleteBtn">Delete</button>
					</span>
				</li>
				`
                ul.innerHTML += listItem
            }

            // First Loop End


            if (list_snapshot.length > list.length) {
                for (var i = list.length; i < list_snapshot.length; i++) {
                    document.getElementById(`data-row-${i}`).remove()
                }
            }

            list_snapshot = list



            //2nd Loop Start
            for (let i in list) {
                let editBtn = document.getElementsByClassName("editBtn")[i]
                let deleteBtn = document.getElementsByClassName("deleteBtn")[i]
                let mainTitle = document.getElementsByClassName("mainTitle")[i]

                editBtn.addEventListener('click', function() {
                    editItem(list[i])
                })


                deleteBtn.addEventListener('click', function() {
                    deleteItem(list[i])
                })

                mainTitle.addEventListener('click', function() {
                    strikeUnstrike(list[i])
                })

            }
            //2nd Loop End

        }) // Here .then() End

} // buildList Function End




let form = document.querySelector('#form')
form.addEventListener('submit', createItem)

function createItem(e) {
    e.preventDefault()


    let URL = "http://127.0.0.1:8000/api/task-create/"

    // Here This two line code is use for reuse fetch for update thats mean put request
    if (activeItem != null) {
        URL = `http://127.0.0.1:8000/api/task-update/${activeItem.id}/`
        activeItem = null
    }

    let title = document.querySelector('#title').value
    fetch(URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                'title': title
            })
        })
        .then(res => {
            buildList()
            document.querySelector('#form').reset()
        })

}





function editItem(item) {
    activeItem = item
    document.querySelector('#title').value = activeItem.title
        // Here We don't use fetch because we use this in upper function when we create a list
}



function deleteItem(item) {

    let URL = `http://127.0.0.1:8000/api/task-delete/${item.id}/`
    fetch(URL, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },

        })
        .then(res => {
            buildList()
        })
}





function strikeUnstrike(item) {

    //Thats mean when completed is true then fetch it
    item.completed = !item.completed
    let URL = `http://127.0.0.1:8000/api/task-update/${item.id}/`
    fetch(URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({
                'title': item.title,
                'completed': item.completed
            })

        })
        .then(res => {
            buildList()
        })

}