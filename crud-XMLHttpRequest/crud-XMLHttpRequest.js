// We have to raise the json web server to read the data and we raise the page as a live server
//json-server -w -p 5000 db.jsom

//REST API: Data consumption with REST client

// Invoking dom variables
const d = document,
    $form = d.querySelector(".crud-form"),
    $table = d.querySelector(".crud-table"),
    $title = d.querySelector(".crud-title"),
    $template = d.getElementById("crud-template").content,
    $fragment = d.createDocumentFragment();

//Here we create a function that encapsulates everything and for each of the methods (put, get...) we ask for the necessary elements
// Here the function that handles the ajax request is separate from the one that interacts with the dom

const ajax = (options) => {
    let { url, method, success, error, data } = options;

    //XMLHttpRequest obj instance
    const xhr = new XMLHttpRequest();

    //Adding the listener. Here all the validations are executed
    xhr.addEventListener("readystatechange", e => {
        if (xhr.readyState !== 4) return;

        //In case of success validate that
        if (xhr.status >= 200 && xhr.status < 300) {

            let json = JSON.parse(xhr.responseText);
            success(json)
        } else {
            //error handler
            let message = error.statusText || "Ocurrio u error";
            error(`Error ${xhr.status} : ${message}`)
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        // xhr.setRequestHeader("header", "Access-Control-Allow-Origin: *");

    xhr.send(JSON.stringify(data));

};

//Here the function is created first and then it is called
//This function is the one that interacts with the html.
const getAll = () => {
    ajax({
        method: "GET", 
        url: "http://localhost:5000/santos",
        success: (res) => { 
            console.log(res)

            res.forEach(el => {
                //render the template data
                $template.querySelector(".name").textContent = el.nombre;
                $template.querySelector(".constellation").textContent = el.constelacion;

                // Add a data-attribute to the button for when to save the id of the button so that when we click it it can execute something
                $template.querySelector(".edit").dataset.name = el.nombre;
                $template.querySelector(".edit").dataset.constellation = el.constelacion;
                $template.querySelector(".delete").dataset.id = el.id;

                //cloning the template
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });

            //Render the data in the DOM
            $table.querySelector("tbody").appendChild($fragment)
        },
        error: (err) => {
            console.log(err)
            $table.insertAdjacentHTML('afterend', ` <p><b>${err}</b></p>`);

        },
        data: null

    })
}

//////////////////////////////////
d.addEventListener("DOMContentLoaded", getAll)

//////////////////////////////////
//Function that processes the creation and editing of data
d.addEventListener("submit", e => {
    if (e.target === $form) {
        e.preventDefault();

        if (!e.target.id.value) {
            // When the form is empty use seremo post to create (Crate POST)
            // New ajax instance. Here we pass the headers. But they are already in the first function
            //Create - POST
            ajax({
                url: "http://localhost:5000/santos",
                method: "POST",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: { 
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }

            });
            console.log(data);
        } else {
            Update - PUT
            ajax({ //Here we access the hidden input to edit
                url: `http://localhost:5000/santos/${e.target.id.value}`,
                method: "PUT",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: { 
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }

            });

            //if the form comes with something we will do an update.
            ajax({
                url: `http://localhost:5555/santos/${e.target.id.value}`,
                method: "PUT",
                success: (res) => location.reload(),
                error: (err) => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    nombre: e.target.nombre.value,
                    constelacion: e.target.constelacion.value
                }
            });
        }

    }
});

//////////////////////////////////
//This function fills in the form upon clicking the edit button. for the PUT method
d.addEventListener("click", e => {
    //Insete en el form los datos para editar
    if (e.target.matches(".edit")) {
        $title.textContent = "Editar Santos";
        $form.nombre.value = e.target.dataset.name;
        $form.constelacion.value = e.target.dataset.constellation;
        $form.id.value = e.target.dataset.id;
    }
});

//////////////////////////////////
//This function or event that deletes a data click on the delete button. for the DELETE method
d.addEventListener("click", e => {
    if (e.target.matches(".delete")) {

    }
});