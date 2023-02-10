window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/manager',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_manager").addEventListener("click", function(){
        $("#managerModal").modal('show');
    });

    //iz footera
    document.getElementById("addManagerBtn").addEventListener("click", createManager);
});

function createManager(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#managerModal").modal('show');

    let manager={
      first_name: document.getElementById("input_first_name_id").value,
      last_name: document.getElementById("input_last_name_id").value,
      username: document.getElementById("input_username_id").value,
      password: document.getElementById("input_password_id").value,

    };

    json_manager = JSON.stringify(manager);

    fetch("http://localhost:8000/admin/manager/addManager",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_manager
    })
    .then((response)=>response.json())
    .then(data=>{
        if(data.msg){
            alert(data.msg);
        }else{
            fetch('http://localhost:8000/admin/manager', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then((response)=>response.json())
            .then((data)=>updateTable(data));
        }
    });


     document.getElementById("input_first_name_id").value="",
     document.getElementById("input_last_name_id").value="",
     document.getElementById("input_username_id").value="",
     document.getElementById("input_password_id").value="",

  
    $("#managerModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    var tabela=document.getElementById("managerTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-managerID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].first_name +'</td><td>' +
        data[i].last_name +  '</td><td>'+
         data[i].username +  '</td><td>' + data[i].password+
          '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.managerid;
            fetch("http://localhost:8000/admin/manager/deleteManager/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/manager", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editManagerModal").modal('show');
            let manager_id=this.parentNode.parentNode.dataset.managerid;

            document.getElementById("editManagerBtn").addEventListener("click", function(){
                let edit={
                   id: manager_id,
                   first_name: document.getElementById("edit_input_first_name_id").value,
                   last_name:document.getElementById("edit_input_last_name_id").value,
                   username:document.getElementById("edit_input_username_id").value,
                   password: document.getElementById("edit_input_password_id").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/manager/editManager/"+manager_id,{
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
                    }
                    else{
                    fetch("http://localhost:8000/admin/manager", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_first_name_id").value="",
                document.getElementById("edit_input_last_name_id").value="",
                document.getElementById("edit_input_username_id").value="",
                document.getElementById("edit_input_password_id").value="",

                $("#editManagerModal").modal('hide');
            });
        });
    }
}