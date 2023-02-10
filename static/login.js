window.addEventListener("load", () => {
    document.getElementById("btn_login").addEventListener('click', e => {
        e.preventDefault();

        console.log("login_clicked");

        const data = {
            username: document.getElementById('login_username').value,
            password: document.getElementById('login_password').value
        };

        /*svaki odgovor fetch-a se konvertuje u json*/

        //anonymous expression, anonymous function

        /*
            const el = {
                "token" : "$Sz$10y$asjdajs8123xacc8u14iuli1j"
            }
        */

        fetch("http://127.0.0.1:9000/login", {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(el => {
            if(el.msg){
                alert(el.msg);
            }else{
                document.cookie = `token=${el.token};SameSite=Lax`; // interpolacija
                window.location.href = 'admin_dashboard.html';
            }
        });
    });
});