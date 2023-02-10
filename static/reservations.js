window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];


    fetch('http://localhost:8000/admin/reservation',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_reservation").addEventListener("click", function(){
        $("#reservationModal").modal('show');
    });

    //iz footera
    document.getElementById("addReservationBtn").addEventListener("click", createReservation);
});

function createReservation(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#reservationModal").modal('show');

    let reservation={
      user_res_id: document.getElementById("input_user_res_id").value,
      seat_res_id: document.getElementById("input_seat_res_id").value,
      auditorium_res_id: document.getElementById("input_auditorium_res_id").value,
      movie_res_id: document.getElementById("input_movie_res_id").value,
      schedule_id: document.getElementById("input_schedule_id").value
      
    };

    json_reservation = JSON.stringify(reservation);

    fetch("http://localhost:8000/admin/reservation/addReservation",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_reservation
    })
    .then((response)=>response.json())
    .then(data=>{
        if(data.msg){
            alert(data.msg);
        }else{
        fetch('http://localhost:8000/admin/reservation', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
        }
    });

    document.getElementById("input_user_res_id").value="";
    document.getElementById("input_seat_res_id").value="";
    document.getElementById("input_auditorium_res_id").value="";
    document.getElementById("input_movie_res_id").value="";
    document.getElementById("input_schedule_id").value="";
    

    $("#reservationModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    var tabela=document.getElementById("reservationTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-reservationID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].user_res_id +'</td><td>' +
         data[i].seat_res_id + '</td><td>' + 
         data[i].auditorium_res_id +  '</td><td>'+ 
         data[i].movie_res_id + '</td><td>'+ 
         data[i].schedule_id + '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        let id=delete_bts[i].parentNode.parentNode.dataset.reservationid;
        delete_bts[i].addEventListener("click", function(){
            fetch("http://localhost:8000/admin/reservation/deleteReservation/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/reservation", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }


    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editReservationModal").modal('show');
            let reservation_id=this.parentNode.parentNode.dataset.reservationid;

            document.getElementById("editReservationBtn").addEventListener("click", function(){
                let edit={
                    id: reservation_id,
                    user_res_id: document.getElementById("edit_input_user_res_id").value,
                    seat_res_id: document.getElementById("edit_input_seat_res_id").value,
                    auditorium_res_id: document.getElementById("edit_input_auditorium_res_id").value,
                    movie_res_id: document.getElementById("edit_input_movie_res_id").value,
                    schedule_id: document.getElementById("edit_input_schedule_id").value

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/reservation/editReservation/"+reservation_id,{
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
                    fetch("http://localhost:8000/admin/reservation", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_user_res_id").value="";
                document.getElementById("edit_input_seat_res_id").value="";
                document.getElementById("edit_input_auditorium_res_id").value="";
                document.getElementById("edit_input_movie_res_id").value="";
                document.getElementById("edit_input_schedule_id").value="";

                $("#editReservationModal").modal('hide');
            });
        });
    }
}