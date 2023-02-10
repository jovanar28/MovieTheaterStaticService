window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/ticket',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_ticket").addEventListener("click", function(){
        $("#ticketModal").modal('show');
    });

    //iz footera
    document.getElementById("addTicketBtn").addEventListener("click", createTicket);
});

function createTicket(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    $("#ticketModal").modal('show');

    let ticket={
      ticket_res_id: document.getElementById("input_ticket_res_id").value,
      price: document.getElementById("input_price").value,
      user_tk_id: document.getElementById("input_user_tk_id").value,
      seat_tk_id: document.getElementById("input_seat_tk_id").value,
      auditorium_tk_id: document.getElementById("input_auditorium_tk_id").value,
      movie_tk_id: document.getElementById("input_movie_tk_id").value,
      sch_tk_id: document.getElementById("input_sch_tk_id").value

    };

    json_ticket= JSON.stringify(ticket);

    fetch("http://localhost:8000/admin/ticket/addTicket",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_ticket
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/ticket', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_ticket_res_id").value="";
    document.getElementById("input_price").value="";
    document.getElementById("input_user_tk_id").value="";
    document.getElementById("input_seat_tk_id").value="";
    document.getElementById("input_auditorium_tk_id").value="";
    document.getElementById("input_movie_tk_id").value="";
    document.getElementById("input_sch_tk_id").value="";

    $("#ticketModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    var tabela=document.getElementById("ticketTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-ticketID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].ticket_res_id +'</td><td>' +
         data[i].price + '</td><td>' + data[i].user_tk_id +  '</td><td>'+
         data[i].seat_tk_id +  '</td><td>' + data[i].auditorium_tk_id+  '</td><td>'+
         data[i].movie_tk_id +  '</td><td>'+ data[i].sch_tk_id + '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.ticketid;
            fetch("http://localhost:8000/admin/ticket/deleteTicket/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/ticket", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
           
            $("#editTicketModal").modal('show');
            let ticket_id=this.parentNode.parentNode.dataset.ticketid;
            document.getElementById("editTicketBtn").addEventListener("click", function(){
                let edit={
                    id: ticket_id,
                    ticket_res_id: document.getElementById("edit_input_ticket_res_id").value,
                    price: document.getElementById("edit_input_price").value,
                    user_tk_id: document.getElementById("edit_input_user_tk_id").value,
                    seat_tk_id: document.getElementById("edit_input_seat_tk_id").value,
                    auditorium_tk_id: document.getElementById("edit_input_auditorium_tk_id").value,
                    movie_tk_id: document.getElementById("edit_input_movie_tk_id").value,
                    sch_tk_id: document.getElementById("edit_input_sch_tk_id").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/ticket/editTicket/"+ticket_id,{
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
                    }else if(data.error){
                        alert(data.error);
                    }else{
                        fetch("http://localhost:8000/admin/ticket", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                        .then(response=>response.json())
                        .then(tableData=>updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_ticket_res_id").value="";
                document.getElementById("edit_input_price").value="";
                document.getElementById("edit_input_user_tk_id").value="";
                document.getElementById("edit_input_seat_tk_id").value="";
                document.getElementById("edit_input_auditorium_tk_id").value="";
                document.getElementById("edit_input_movie_tk_id").value="";
                document.getElementById("edit_input_sch_tk_id").value="";
            

                $("#editTicketModal").modal('hide');
            });
           
        });
    }
}