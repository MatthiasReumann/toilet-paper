const AppData = {
    users: [],
    purchases: []
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

function hideModal(elementid){
    var userModalElement = $(elementid)
    var modal = bootstrap.Modal.getInstance(userModalElement);
    modal.hide();
}

let hideUserModal = () => hideModal("#addMemberModal")
let hidePurchaseModal = () => hideModal("#addPurchaseModal")

function listUsers(){
    $.get("/users", (users) => {
        AppData.users = users;
        updateUserList();
        updateStats();
    }).fail(() => {
        console.error("GET /users failed.");
    })
}

function updateUserList(){
    $("#members option").remove();
    AppData.users.forEach((user) => {
        $("#members").append(`<option value = "${user.id}">${user.name}</option>`)
    });
}

function addPurchase(){
    const name = $("input[name='item-name']").val();
    const priceInCent = $("input[name='item-price']").val() * 100;
    const userid = $("select[name='item-member']").val();
    
    const body = {
        name: name,
        priceInCent: priceInCent,
        user: {
            id: userid
        }
    };
    
    $.post("/purchases", body, (response) => {
        hidePurchaseModal();
        listPurchases();
    }).fail(()=>{
        console.error("POST /purchases failed.");
    })
}

function listPurchases(){
    $.get("/purchases", (purchases) => {
        AppData.purchases = purchases;
        updatePurchasesList();
        updateStats();
    }).fail(() => {
        console.error("GET /purchases failed.");
    })
}

function updatePurchasesList(){
    $('#purchases li').remove();
    
    const limited = AppData.purchases.reverse().slice(0,5);
    
    limited.forEach((purchase) => {
        $('#purchases').append(`<li class = "list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                        <div class="fw-bold">${purchase.name}</div>
                                        ${purchase.priceInCent/100}
                                    </div>
                                    <span class="badge bg-black rounded-pill">#2</span>
                                    </li>
                               `)
    })
}

function getStats(){
    const stats = {
        total: 0,
        users: []
    }
    AppData.users.forEach((user) => {
        let spent = 0;
        AppData.purchases.forEach((purchase) => {
            if(user.id === purchase.user.id){
                spent += purchase.priceInCent;
            }
        })
        stats.users.push({
            name: user.name,
            color: user.color,
            spent: spent
        });
        stats.total += spent;
    });
    
    return stats;
}

function updateStats(){
    $("#stats .col-auto").remove();
    
    const stats = getStats();
    
    const statsContainer = $("#stats");
    
    stats.users.forEach((user) => {
        const inPixel = (user.spent / stats.total) * 100;
        
        statsContainer.append(`<div class = "col-auto position-relative">
                                    <div class = "d-flex justify-content-center mb-2">
                                        <span class="badge bg-secondary">${user.spent/100}</span>
                                    </div>
                                    <div class = "bar ms-auto me-auto mb-3" style="height: ${inPixel}px;background:${user.color};"></div>
                                    <div>
                                    <div class = "stats-img-wrap bg-white p-1 shadow rounded-circle">
                                      <img class = "rounded-circle" src = "/img/${user.name}.jpg">
                                    </div>
                              </div>`)
    });
}
