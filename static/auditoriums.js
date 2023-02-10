
window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/auditorium',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_dodaj_novi_auditorium").addEventListener("click", function(){
        $("#auditoriumModal").modal('show');
    });

    //iz footera
    document.getElementById("addAuditoriumBtn").addEventListener("click", createAuditorium);
});

function createAuditorium(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    $("#auditoriumModal").modal('show');

    let auditorium={
       number_of_seats: document.getElementById("input_number_of_seats").value,
       movietheater_id: document.getElementById("input_movietheater_id").value
    };

    json_auditorium = JSON.stringify(auditorium);

    fetch("'http://localhost:8000/admin/auditorium/addAuditorium",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_auditorium
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/auditorium', {method:"GET", headers:{'Authorization' :`Bearer ${token}` }})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_number_of_seats").value="";
    document.getElementById("input_movietheater_id").value="";

    $("#auditoriumModal").modal('hide');

}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela=document.getElementById("auditoriumTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-auditoriumID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].number_of_seats +'</td><td>' +
         data[i].movietheater_id + `</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>`;

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        let id=delete_bts[i].parentNode.parentNode.dataset.auditoriumid;
        delete_bts[i].addEventListener("click", function(){
            fetch("http://localhost:8000/admin/auditorium/deleteAuditorium/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/auditorium", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editAuditoriumModal").modal('show');
            let auditorium_id=this.parentNode.parentNode.dataset.auditoriumid;

            document.getElementById("editAuditoriumBtn").addEventListener("click", function(){
                let edit={
                    id: auditorium_id,
                    number_of_seats: document.getElementById("edit_input_number_of_seats").value,
                    movietheater_id:document.getElementById("edit_input_movietheater_id").value

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/auditorium/editAuditorium/"+auditorium_id,{
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
                    if(data.msg){
                        alert(data.msg);
                    }else{
                        fetch("http://localhost:8000/admin/auditorium", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                        .then(response=>response.json())
                        .then(tableData=>updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_number_of_seats").value="";
                document.getElementById("edit_input_movietheater_id").value="";

                $("#editAuditoriumModal").modal('hide');
            });
        });
    }   
}
