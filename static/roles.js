
window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/role',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_dodaj_novi_role").addEventListener("click", function(){
        $("#roleModal").modal('show');
    });

    //iz footera
    document.getElementById("addRoleBtn").addEventListener("click", createRole);
});

function createRole(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#rolemodal").modal('show');

    let role={
       role_name: document.getElementById("input_role_name").value
    };

    json_role = JSON.stringify(role);

    fetch("http://localhost:8000/admin/role/addRole",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_role
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/role', {method:"GET", headers:{'Authorization' :`Bearer ${token}` }})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_role_name").value="";
  

    $("#roleModal").modal('hide');

}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela=document.getElementById("roleTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-roleID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].role_name+
          `</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>`;

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        let id=delete_bts[i].parentNode.parentNode.dataset.roleid;
        delete_bts[i].addEventListener("click", function(){
            fetch("http://localhost:8000/admin/role/deleteRole/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/role", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editRoleModal").modal('show');
            let role_id=this.parentNode.parentNode.dataset.roleid;

            document.getElementById("editRoleBtn").addEventListener("click", function(){
                let edit={
                    id: role_id,
                    role_name: document.getElementById("edit_input_role_name").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/role/editRole/"+role_id,{
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
                    fetch("http://localhost:8000/admin/role", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_role_name").value="";
              

                $("#editRoleModal").modal('hide');
            });
        });
    }   
}
