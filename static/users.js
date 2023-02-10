window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/user',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_user").addEventListener("click", function(){
        $("#userModal").modal('show');
    });

    //iz footera
    document.getElementById("addUserBtn").addEventListener("click", createUser);
});

function createUser(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#userModal").modal('show');

    let user={
      first_name: document.getElementById("input_first_name_id").value,
      last_name: document.getElementById("input_last_name_id").value,
      username: document.getElementById("input_username_id").value,
      password: document.getElementById("input_password_id").value,
      credit_card_num: document.getElementById("input_credit_card_num_id").value,
      role_id: document.getElementById("input_role_id").value
      
    };

    json_user = JSON.stringify(user);

    fetch("http://localhost:8000/admin/user/addUser",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_user
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/user', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });


     document.getElementById("input_first_name_id").value="",
     document.getElementById("input_last_name_id").value="",
     document.getElementById("input_username_id").value="",
     document.getElementById("input_password_id").value="",
     document.getElementById("input_credit_card_num_id").value="",
     document.getElementById("input_role_id").value=""
 
    $("#userModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    var tabela=document.getElementById("userTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-userID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].first_name +'</td><td>' +
        data[i].last_name +  '</td><td>'+
         data[i].username +  '</td><td>' + data[i].password+  '</td><td>'+
         data[i].credit_card_num +  '</td><td>' + data[i].role_id +
          '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.userid;
            fetch("http://localhost:8000/admin/user/deleteUser/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/user", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editUserModal").modal('show');
            let user_id=this.parentNode.parentNode.dataset.userid;
            document.getElementById("editTicketBtn").addEventListener("click", function(){
                let edit={
                    id: ticket_id,
                    first_name: document.getElementById("edit_input_first_name_id").value,
                    last_name: document.getElementById("edit_input_last_name_id").value,
                    username: document.getElementById("edit_input_username_id").value,
                    password: document.getElementById("edit_input_password_id").value,
                    credit_card_num: document.getElementById("edit_input_credit_card_num_id").value,
                    role_id: document.getElementById("edit_input_role_id").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/user/editUser/"+user_id,{
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
                    fetch("http://localhost:8000/admin/user", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });
                document.getElementById("edit_input_first_name_id").value="",
                document.getElementById("edit_input_last_name_id").value="",
                document.getElementById("edit_input_username_id").value="",
                document.getElementById("edit_input_password_id").value="",
                document.getElementById("edit_input_credit_card_num_id").value="",
                document.getElementById("edit_input_role_id").value="",
                $("#editUserModal").modal('hide');
            });
        });
    }
}