const AppData = {
    users: []
}

$(document).ready(() => {
    $("#form-add-user").submit((e) => {
        e.preventDefault();
        addUser();
    });
    
   $("#form-add-purchase").submit((e) => {
        e.preventDefault();
        addPurchase();
    });
    listPurchases();
    listUsers();
    getStats();
});

function addUser(){
    const form = $("#form-add-user")[0];
    const formData = new FormData(form);
    
    $.ajax({
        url: "/users",
        type: "POST",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        success: (res) => {
            hideUserModal();
            listUsers();
        }
    });
}

function hideUserModal(){
    var userModalElement = $('#addMemberModal')
    var modal = bootstrap.Modal.getInstance(userModalElement);
    modal.hide();
}

function listUsers(){
    $.get("/users", (data) => {
        AppData.users = data.users;
        updateUserList(data.users);
        getStats();
    }).fail(() => {
        console.error("GET /users failed.");
    })
}

function updateUserList(users){
    $("#members option").remove();
    users.forEach((user) => {
        $("#members").append(`<option>${user.name}</option>`)
    });
}

function getStats(){
    $.get("/purchases/stats", (data) => {
        updateStats(data);
    }).fail(() => {
        console.error("GET /purchases/stats failed.")
    });
}

function updateStats(data){
    $("#stats .col-auto").remove();
    
    const statsContainer = $("#stats");
    console.log(data);
    data.individuals.forEach(individual => {
        const fraction = individual.amount / data.total;
        const inPixel = fraction * 100;
        const member = AppData.users.find(user => user.name === individual.member);
        statsContainer.append(`<div class = "col-auto position-relative">
                                <div class = "d-flex justify-content-center mb-2">
                                    <span class="badge bg-secondary">${individual.amount/100}</span>
                                </div>
                                <div class = "bar ms-auto me-auto mb-3" style="height: ${inPixel}px;"></div>
                                <div>
                                <div class = "stats-img-wrap bg-white p-1 shadow rounded-circle">
                                  <img class = "rounded-circle "src = ${member.imageBase64}">
                                </div>
                                </div>
                              </div>`)
    });
}

function addPurchase(){
    const name = $("input[name='item-name']").val();
    const priceInCent = $("input[name='item-price']").val() * 100;
    const member = $("select[name='item-member']").val();
    
    const body = {
        name: name,
        priceInCent: priceInCent
    };
    
    $.post("/purchases/" + member, body, (response) => {
        listPurchases();
        getStats();
    }).fail(()=>{
        console.error("POST /purchases failed.");
    })
}

function listPurchases(){
    $.get("/purchases", (data) => {
        updatePurchasesList(data.purchases);
    }).fail(() => {
        console.error("GET /purchases failed.");
    })
}

function updatePurchasesList(purchases){
    $('#purchases li').remove();
    
    purchases.forEach((purchase) => {
        $('#purchases').append(`<li class = "list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">${purchase.name}</div>
                                        ${purchase.priceInCent/100}
                                    </div>
                                    <span class="badge bg-primary rounded-pill">2</span>
                                    </li>
                               `)
    })
}
