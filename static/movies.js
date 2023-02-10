window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/movie',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_movie").addEventListener("click", function(){
        $("#movieModal").modal('show');
    });

    //iz footera
    document.getElementById("addMovieBtn").addEventListener("click", createMovie);
});

function createMovie(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#movieModal").modal('show');

    let movie={
      tittle: document.getElementById("input_tittle").value,
      duration: document.getElementById("input_duration").value,
      genre: document.getElementById("input_genre").value
    };

    json_movie = JSON.stringify(movie);

    fetch("http://localhost:8000/admin/movie/addMovie",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_movie
    })
    .then((response)=>response.json())
    .then(data=>{
        if(data.msg){
            alert(data.msg);
        }else{
            fetch('http://localhost:8000/admin/movie', {method:"GET", header:{'Authorization' : `Bearer ${token}`}})
            .then((response)=>response.json())
            .then((data)=>updateTable(data));
        }
    });

    document.getElementById("input_tittle").value="";
    document.getElementById("input_duration").value="";
    document.getElementById("input_genre").value="";

    $("#movieModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    var tabela=document.getElementById("movieTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-movieID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].tittle +'</td><td>' +
         data[i].duration + '</td><td>' + data[i].genre + 
         '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const movie_id = this.parentNode.parentNode.dataset.movieid;
            fetch("http://localhost:8000/admin/movie/deleteMovie/" + movie_id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/movie", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editMovieModal").modal('show');
            let movie_id=this.parentNode.parentNode.dataset.movieid;

            document.getElementById("editMovieBtn").addEventListener("click", function(){
                let edit={
                    id: movie_id,
                    tittle: document.getElementById("edit_input_tittle").value,
                    duration: document.getElementById("edit_input_duration").value,
                    genre: document.getElementById("edit_input_genre").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/movie/editMovie/"+movie_id,{
                    method:"PUT",
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body:http_body
                })
                .then(response=>response.json())
                .then(data=>{
                    fetch("http://localhost:8000/admin/movie", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_tittle").value="";
                document.getElementById("edit_input_duration").value="";
                document.getElementById("edit_input_genre").value="";

                $("#editMovieModal").modal('hide');
            });
        });
    }
}