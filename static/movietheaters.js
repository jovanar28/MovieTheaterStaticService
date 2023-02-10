window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/movietheater',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_movietheater").addEventListener("click", function(){
        $("#movietheaterModal").modal('show');
    });

    //iz footera
    document.getElementById("addMovietheaterBtn").addEventListener("click", createMovietheater);
});

function createMovietheater(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#movietheaterModal").modal('show');

    let movietheater={
       name: document.getElementById("input_name").value,
       location_id: document.getElementById("input_location_id").value,
       manager_id: document.getElementById("input_manager_id").value
    };

    json_movietheater = JSON.stringify(movietheater);

    fetch("http://localhost:8000/admin/movietheater/addMovietheater",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_movietheater
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/movietheater', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_name").value="";
    document.getElementById("input_location_id").value="";
    document.getElementById("input_manager_id").value="";

    $("#movietheaterModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    var tabela=document.getElementById("movietheaterTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-movietheaterID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].name +'</td><td>' +
         data[i].location_id +  '</td><td>' + 
         data[i].manager_id + '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.movietheaterid;
            fetch("http://localhost:8000/admin/movietheater/deleteMovietheater/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/movietheater", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editMovietheaterModal").modal('show');
            let movietheater_id=this.parentNode.parentNode.dataset.movietheaterid;

            document.getElementById("editMovietheaterBtn").addEventListener("click", function(){
                let edit={
                    id: movietheater_id,
                    name: document.getElementById("edit_input_name").value,
                    location_id: document.getElementById("edit_input_location_id").value,
                    manager_id: document.getElementById("edit_input_manager_id").value

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/movietheater/editMovietheater/"+movietheater_id,{
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
                    fetch("http://localhost:8000/admin/movietheater", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_name").value="";
                document.getElementById("edit_input_location_id").value="";
                document.getElementById("edit_input_manager_id").value="";

                $("#editMovietheaterModal").modal('hide');
            });
        });
    }
}