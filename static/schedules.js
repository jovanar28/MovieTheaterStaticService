window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/schedule',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_schedule").addEventListener("click", function(){
        $("#scheduleModal").modal('show');
    });

    //iz footera
    document.getElementById("addScheduleBtn").addEventListener("click", createSchedule);
});

function createSchedule(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    $("#scheduleModal").modal('show');

    let schedule={
      movie_sch_id: document.getElementById("input_movie_sch_id").value,
      auditorium_sch_id: document.getElementById("input_auditorium_sch_id").value,
      start_time: document.getElementById("input_start_time_id").value,
      end_time: document.getElementById("input_end_time_id").value,
      date: document.getElementById("input_date_id").value
     
    };

    json_schedule = JSON.stringify(schedule);

    fetch("http://localhost:8000/admin/schedule/addSchedule",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_schedule
    })
    .then((response)=>response.json())
    .then(data=>{
        if(data.msg){
            alert(data.msg);
        }else{
        fetch('http://localhost:8000/admin/schedule', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
        }
    });

    document.getElementById("input_movie_sch_id").value="";
    document.getElementById("input_auditorium_sch_id").value="";
    document.getElementById("input_start_time_id").value="";
    document.getElementById("input_end_time_id").value="";
    document.getElementById("input_date_id").value="";

    $("#scheduleModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    var tabela=document.getElementById("scheduleTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-scheduleID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].movie_sch_id +'</td><td>' +
       + data[i].auditorium_sch_id +  '</td><td>'+
         data[i].start_time +  '</td><td>' + data[i].end_time+  '</td><td>'+
         data[i].date +  '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.scheduleid;
            fetch("http://localhost:8000/admin/schedule/deleteSchedule/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/schedule", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editScheduleModal").modal('show');
            let schedule_id=this.parentNode.parentNode.dataset.scheduleid;

            document.getElementById("editScheduleBtn").addEventListener("click", function(){
                let edit={
                    id: schedule_id,
                    movie_sch_id: document.getElementById("edit_input_movie_sch_id").value,
                    auditorium_sch_id: document.getElementById("edit_input_auditorium_sch_id").value,
                    start_time: document.getElementById("edit_input_start_time_id").value,
                    end_time: document.getElementById("edit_input_end_time_id").value,
                    date: document.getElementById("edit_input_date_id").value
                    

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/schedule/editSchedule/"+schedule_id,{
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
                    fetch("http://localhost:8000/admin/schedule", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_movie_sch_id").value="";
                document.getElementById("edit_input_auditorium_sch_id").value="";
                document.getElementById("edit_input_start_time_id").value="";
                document.getElementById("edit_input_end_time_id").value="";
                document.getElementById("edit_input_date_id").value="";

                $("#editScheduleModal").modal('hide');
            });
        });
    }
}