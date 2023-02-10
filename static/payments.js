window.addEventListener("load",()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:8000/admin/payment',{
        method:"GET",
        headers: {"Authorization" : `Bearer ${token}`}
    }).then(response=>response.json())
    .then(data=>{
        console.log(data);
        updateTable(data);
    });

    document.getElementById("btn_add_new_payment").addEventListener("click", function(){
        $("#paymentModal").modal('show');
    });

    //iz footera
    document.getElementById("addPaymentBtn").addEventListener("click", createPayment);
});

function createPayment(){
    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    $("#paymentModal").modal('show');

    let payment={
      user_pay_id: document.getElementById("input_user_pay_id").value,
      seat_pay_id: document.getElementById("input_seat_pay_id").value,
      auditorium_pay_id: document.getElementById("input_auditorium_pay_id").value,
      movie_pay_id: document.getElementById("input_movie_pay_id").value,
      sch_pay_id: document.getElementById("input_sch_pay_id").value,
      res_pay_id: document.getElementById("input_res_pay_id").value,
      amount: document.getElementById("input_amount").value

    };

    json_payment = JSON.stringify(payment);

    fetch("http://localhost:8000/admin/payment/addPayment",{
        method:"POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: json_payment
    })
    .then((response)=>response.json())
    .then(data=>{
        fetch('http://localhost:8000/admin/payment', {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
        .then((response)=>response.json())
        .then((data)=>updateTable(data));
    });

    document.getElementById("input_user_pay_id").value="";
    document.getElementById("input_seat_pay_id").value="";
    document.getElementById("input_auditorium_pay_id").value="";
    document.getElementById("input_movie_pay_id").value="";
    document.getElementById("input_sch_pay_id").value="";
    document.getElementById("input_res_pay_id").value="";
    document.getElementById("input_amount").value="";

    $("#paymentModal").modal('hide');

}

function updateTable(data){

    const cookies=document.cookie.split("=");
    const token=cookies[cookies.length-1];
    
    var tabela=document.getElementById("paymentTable");
    tabela.innerHTML="";

    for(i in data){
        let redHTML= '<tr data-paymentID="' + data[i].id + '"><td>' 
        + data[i].id + '</td><td>' + data[i].user_pay_id +'</td><td>' +
         data[i].seat_pay_id + '</td><td>' + data[i].auditorium_pay_id +  '</td><td>'+
         data[i].movie_pay_id +  '</td><td>' + data[i].sch_pay_id+  '</td><td>'+
         data[i].res_pay_id +  '</td><td>'+ data[i].amount + '</td><td><button class="btn btn-danger btn-sm btn_delete">Delete</button><button class="btn btn-warning btn-sm btn_edit">Edit</button></td';

       tabela.innerHTML+=redHTML;  
    }

    var delete_bts = document.querySelectorAll(".btn_delete");

    for(i=0;i<delete_bts.length;i++){
        delete_bts[i].addEventListener("click", function(){
            const id = this.parentNode.parentNode.dataset.paymentid;
            fetch("http://localhost:8000/admin/payment/deletePayment/" + id, {method:"DELETE", headers:{ 'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data=>{
                fetch("http://localhost:8000/admin/payment", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                .then(response=>response.json())
                .then(data=>updateTable(data));
            });
        });
    }

    var izmeni_bts = document.querySelectorAll(".btn_edit");

    for(i=0;i<izmeni_bts.length;i++){
        izmeni_bts[i].addEventListener("click", function(){
            $("#editPaymentModal").modal('show');
            let payment_id=this.parentNode.parentNode.dataset.paymentid;

            document.getElementById("editPaymentBtn").addEventListener("click", function(){
                let edit={
                    id: payment_id,
                    user_pay_id: document.getElementById("edit_input_user_pay_id").value,
                    seat_pay_id: document.getElementById("edit_input_seat_pay_id").value,
                    auditorium_pay_id: document.getElementById("edit_input_auditorium_pay_id").value,
                    movie_pay_id: document.getElementById("edit_input_movie_pay_id").value,
                    sch_pay_id: document.getElementById("edit_input_sch_pay_id").value,
                    res_pay_id: document.getElementById("edit_input_res_pay_id").value,
                    amount: document.getElementById("edit_input_amount").value

                };
          
                console.log(edit);

                http_body=JSON.stringify(edit);

                fetch("http://localhost:8000/admin/payment/editPayment/"+payment_id,{
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
                    fetch("http://localhost:8000/admin/payment", {method:"GET", headers:{ 'Authorization' : `Bearer ${token}`}})
                    .then(response=>response.json())
                    .then(tableData=>updateTable(tableData));
                });

                document.getElementById("edit_input_user_pay_id").value="";
                document.getElementById("edit_input_seat_pay_id").value="";
                document.getElementById("edit_input_auditorium_pay_id").value="";
                document.getElementById("edit_input_movie_pay_id").value="";
                document.getElementById("edit_input_sch_pay_id").value="";
                document.getElementById("edit_input_res_pay_id").value="";
                document.getElementById("edit_input_amount").value="";

                $("#editPaymentModal").modal('hide');
            });
        });
    }
}