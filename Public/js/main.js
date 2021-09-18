const AppData = {
    users: [],
    purchases: []
}

$(document).ready(() => {
    let timeout = null;
    
    $("#form-add-user").submit((e) => {
        e.preventDefault();
        addUser();
        event.target.reset()
    });
    
   $("#form-add-purchase").submit((e) => {
        e.preventDefault();
        addPurchase();
        event.target.reset()
    });
    
    $("input[name='item-name']").on("keyup", function(){
        let input = $(this).val();

        if(input === ""){
            return;
        }
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            search(input);
        }, 1000);
    });
    
    listPurchases();
    listUsers();
});

function hideModal(elementid){
    var userModalElement = $(elementid)
    var modal = bootstrap.Modal.getInstance(userModalElement);
    modal.hide();
}

let hideUserModal = () => hideModal("#add-member-modal")
let hidePurchaseModal = () => hideModal("#add-purchase-modal");

function clearSearchResults(){
    $("#item-search-result li").remove();
}

function search(q){
    $.get("/search?q="+q, (items)=>{
        showSearchResult(items);
    }).fail(() => console.log("GET /search?q="+q+" failed."))
}

function showSearchResult(items){
    clearSearchResults();
    
    const searchItemResult = $("#item-search-result");
    items.forEach((item, i) => {
        const li = searchItemResult.append(`<li class = "d-flex list-group-item list-group-item-action">
                                    <span class = "me-auto">${item.name}</span>
                                    <span class="badge rounded-pill bg-success">${item.priceInCent/100}</span>
                                </li>`);
        
        li.children().get(i).onclick = () => selectItem(item);
    });
}

function selectItem(item){
    $("input[name='item-name']").val(item.name);
    $("input[name='item-price']").val(item.priceInCent/100);
    
    clearSearchResults();
}

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

function listUsers(){
    $.get("/users", (users) => {
        AppData.users = users;
    }).fail(() => {
        console.error("GET /users failed.");
    }).then(() => {
        updateUserList();
        updateStats();
    })
}

function updateUserList(){
    $("#members option").remove();
    
    const purchaseButton = $("#add-purchase-button");
    
    if(AppData.users.length === 0){
        purchaseButton.prop("disabled",true);
        return;
    }
    
    purchaseButton.prop("disabled",false);
    
    AppData.users.forEach((user) => {
        $("#members").append(`<option value = "${user.id}">${user.name}</option>`)
    });
}

function addPurchase(){
    const body = {
        name: $("input[name='item-name']").val(),
        priceInCent: $("input[name='item-price']").val() * 100,
        amount: $("input[name='item-amount']").val(),
        user: {
            id: $("select[name='item-member']").val()
        }
    };
    
    $.post("/purchases", body, (response) => {
        hidePurchaseModal();
        listPurchases();
    }).fail(() => console.error("POST /purchases failed."));
}

function listPurchases(){
    $.get("/purchases", (purchases) => {
        AppData.purchases = purchases;
    }).fail(() => console.error("GET /purchases failed."))
    .then(() => {
        updatePurchasesList();
        updateStats();
    });
}

function updatePurchasesList(){
    $('#purchases li').remove();
    
    const purchasesHeader = $("#purchases-header");
    
    if(AppData.purchases.length === 0){
        purchasesHeader.html("No purchases yet.");
        return;
    }
    
    purchasesHeader.html("Last 5 Purchases");
    
    const limited = AppData.purchases.reverse().slice(0,5);
    
    limited.forEach((purchase, i) => {
        const li = $("#purchases").append(`<li class = "position-relative list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto mt-auto mb-auto">
                                        <div class="fw-bold">${purchase.name}</div>
                                        ${purchase.priceInCent/100}
                                    </div>
                                    <span class="badge bg-black rounded-pill mt-auto mb-auto me-3">#${purchase.amount}</span>
                                    <span id = "close" class = "fs-1 pb-1 mt-auto mb-auto">+</span>
                                    </div>
                                    </li>
                               `);
        li.children().get(i).onclick = () => deletePurchase(purchase, i);
    });
}

function deletePurchase(purchase, i){
    if (confirm(`Are you sure you want to delete '${purchase.name}'?`))  {
        $.ajax({
            url: "/purchases/" + purchase.id,
            type: 'DELETE',
            success: function(result) {
                listPurchases();
            },
            error: function(err) {
                console.log("DELETE /purchases/" + id + " failed.")
            }
        }).then(() => {});
    }
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
                spent += purchase.priceInCent * purchase.amount;
            }
        });
        
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
