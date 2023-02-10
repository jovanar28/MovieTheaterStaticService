window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/location',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_location").addEventListener("click", function(){
        $("#locationModal").modal('show');
    });

    //iz footera
    document.getElementById("addLocationBtn").addEventListener("click", createLocation);
});

function createLocation(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    $("#locationModal").modal('show');

    let location={
       street_name: document.getElementById("input_street_name_id").value,
       city_name: document.getElementById("input_city_name_id").value
    };

    json_location = JSON.stringify(location);

    fetch("http://localhost:8000/admin/location/addLocation",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_location
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/location', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_street_name_id").value="";
    document.getElementById("input_city_name_id").value="";

    $("#locationModal").modal('hide');

}

function updateTable(data){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];

    var tabela=document.getElementById("locationTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-locationID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].street_name +'</td><td>' +
         data[i].city_name + `</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td>`;

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.locationid;
            fetch("http://localhost:8000/admin/location/deleteLocation/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/location", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editLocationModal").modal('show');
            let location_id=this.parentNode.parentNode.dataset.locationid;

            document.getElementById("editLocationBtn").addEventListener("click", function(){
                let edit={
                    id: location_id,
                    street_name: document.getElementById("edit_input_street_name_id").value,
                    city_name:document.getElementById("edit_input_city_name_id").value
                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/location/editLocation/"+location_id,{
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
                        fetch("http://localhost:8000/admin/location", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                        .then(response=>response.json())
                        .then(tableData=>updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_street_name_id").value="";
                document.getElementById("edit_input_city_name_id").value="";

                $("#editLocationModal").modal('hide');
            });
        });
    }
}