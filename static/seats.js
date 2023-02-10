window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/seat',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_seat").addEventListener("click", function(){
        $("#seatModal").modal('show');
    });

    //iz footera
    document.getElementById("addSeatBtn").addEventListener("click", createSeat);
});

function createSeat(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#seatModal").modal('show');

    let seat={
      auditorium_seat_id: document.getElementById("input_auditorium_seat_id").value
    };

    json_seat = JSON.stringify(seat);

    fetch("http://localhost:8000/admin/seat/addseat",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`

        },
        body: json_seat
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/seat', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

  
    document.getElementById("input_auditorium_seat_id").value="";
   

    $("#seatModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    var tabela=document.getElementById("seatTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-seatID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' 
        + data[i].auditorium_seat_id +  
         '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.seatid;
            fetch("http://localhost:8000/admin/seat/deleteSeat/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/seat", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){          
            $("#editSeatModal").modal('show');
            let seat_id=this.parentNode.parentNode.dataset.seatid;

            document.getElementById("editSeatBtn").addEventListener("click", function(){
                let edit={
                    id: seat_id,
                    auditorium_seat_id: document.getElementById("edit_input_auditorium_seat_id").value

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/seat/editSeat/"+seat_id,{
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
                    fetch("http://localhost:8000/admin/seat", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_auditorium_seat_id").value="";

                $("#editSeatModal").modal('hide');
            });
        });
    }
}