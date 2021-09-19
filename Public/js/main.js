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

    $("#add-purchase-modal").on("show.bs.modal", clearSearchResults);
    
    $("#show-users-modal").on("show.bs.modal", renderUserList);
    
    listPurchases();
    listUsers();
});

function hideModal(elementid){
    var modalElement = $(elementid);
    var modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

function showModal(elementid){
    var modalElement = $(elementid);
    var modal = bootstrap.Modal.getInstance(modalElement);
    modal.show();
}

let hideUserModal = () => hideModal("#add-member-modal");
let hidePurchaseModal = () => hideModal("#add-purchase-modal");
let hideUserListModal = () => hideModal("#show-users-modal");

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
    
    const ul = $("#item-search-result");
    items.forEach((item, i) => {
        ul.append(`<li class = "d-flex list-group-item list-group-item-action">
                                    <span class = "me-auto">${item.name}</span>
                                    <span class="badge rounded-pill bg-success">${item.priceInCent/100}</span>
                                </li>`);
        
        ul.children().get(i).onclick = () => selectItem(item);
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
    const formElements = $("#form-add-user :input");
    const btn = $("#add-user-button");
    
    formElements.prop("disabled", true);
    
    btn.html(`<div class="spinner-border spinner-border-sm mt-1 mb-1 text-light" role="status">
                <span class="visually-hidden">Adding...</span>
             </div>`)
    
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
            formElements.prop("disabled", false);
            btn.html("Add")
        }
    });
}

function listUsers(){
    $.get("/users", (users) => {
        AppData.users = users;
    }).fail(() => {
        console.error("GET /users failed.");
    }).then(() => {
        addUsersToSelect();
        updateStats();
    })
}

function deleteUser(user){
    if(confirm(`Do you really want to delete user '${user.name}'?`)){
        $.ajax({
            url: "/users/" + user.id,
            type: "DELETE",
            success: (data) => {
                hideUserListModal();
                listUsers();
            },
            error: (err) => console.err("DELETE /users/"+user.id+" failed.")
        })
    }
}

function addUsersToSelect(){
    $("#members option").remove();
    
    const purchaseButton = $("#add-purchase-modal-button");
    const showUsersButton = $("#show-users-list-button");
    if(AppData.users.length === 0){
        purchaseButton.prop("disabled",true);
        showUsersButton.prop("disabled", true);
        return;
    }
    
    purchaseButton.prop("disabled",false);
    showUsersButton.prop("disabled", false);
    
    AppData.users.forEach((user) => {
        $("#members").append(`<option value = "${user.id}">${user.name}</option>`)
    });
}

function renderUserList(){
    const ul = $("#users-list");
    
    $("#users-list li").remove();
    
    AppData.users.forEach((user, i)=>{
       ul.append(`<li class="list-group-item">
                    <div class = "d-flex">
                        <span class = "mt-auto mb-auto me-auto">${user.name}</span>
                        <div class = "d-flex mt-auto mb-auto">
                            <button id = "btn-edit-${i}" class = "edit mt-auto mb-auto me-3 type="button" data-bs-toggle="collapse" data-bs-target="#edit-${i}" aria-expanded="false" aria-controls="edit-${i}">
                                    <i class="bi bi-pen"></i>
                            </button>
                            <span class = "del fs-3"><i class="bi bi-x"></i></span>
                        </div>
                    </div>
                    <div class = "collapse mt-3" id="edit-${i}">
                     <form id = "form-edit-user-${i}" class = "d-grid gap-3" method="PUT" enctype="multipart/form-data">
                         <div class = "d-flex">
                             <input type = "text" class = "form-control" placeholder = "Name" name = "name" required>
                             <input type="color" class="form-control form-control-color ms-3" id="color" value="#f3f" title="Choose your color" name = "color" required>
                         </div>
                         <div>
                             <label for="user-image" class="form-label">Member Image</label>
                             <input type = "file" id = "user-image" class = "form-control" placeholder = "Image" name = "image">
                         </div>
                         <button id = "edit-user-button" class="btn btn-dark w-100">Update</button>
                     </form>
                    </div>
                 </li>`)
        
        ul.find(".del").get(i).onclick = () => deleteUser(user);
        ul.find(".edit").get(i).onclick = () => onUserEditClick(user, i);
    });
}

function onUserEditClick(user, i){
    // set button fill
    const btn = $(`#btn-edit-${i}`);
    btn.html().trim() === '<i class="bi bi-pen"></i>' ?
        btn.html('<i class="bi bi-pen-fill"></i>') :
        btn.html('<i class="bi bi-pen"></i>');
    
    // set values
    $(`#form-edit-user-${i} input[name='name']`).val(user.name);
    $(`#form-edit-user-${i} input[name='color']`).val(user.color);
}

function addPurchase(){
    const formElements = $("#form-add-purchase :input");
    formElements.prop("disabled", true);
    
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
    })
    .fail(() => console.error("POST /purchases failed."))
    .then(() => formElements.prop("disabled", false))
}

function listPurchases(){
    $.get("/purchases", (purchases) => {
        AppData.purchases = purchases;
    }).fail(() => console.error("GET /purchases failed."))
    .then(() => {
        renderPurchasesList();
        updateStats();
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
            error: (err) => console.log("DELETE /purchases/" + id + " failed.")
        }).then(() => {});
    }
}

function renderPurchasesList(){
    $('#purchases li').remove();
    
    const purchasesHeader = $("#purchases-header");
    
    if(AppData.purchases.length === 0){
        purchasesHeader.html("No purchases yet.");
        return;
    }
    
    purchasesHeader.html("Last 5 Purchases");
    
    const limited = AppData.purchases.reverse().slice(0,5);
    
    limited.forEach((purchase, i) => {
        const ul = $("#purchases").append(`<li class = "position-relative list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto mt-auto mb-auto">
                                        <div class="fw-bold">${purchase.name}</div>
                                        ${purchase.priceInCent/100}
                                    </div>
                                    <span class="badge bg-black rounded-pill mt-auto mb-auto me-3">#${purchase.amount}</span>
                                    <span class = "del fs-1 mt-auto mb-auto"><i class="bi bi-x"></i></span>
                                    </div>
                                    </li>
                               `);
        
        ul.find(".del").get(i).onclick = () => deletePurchase(purchase, i);
    });
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
            id: user.id,
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
        statsContainer.append(`<div class = "col-auto position-relative mt-3 mb-3">
                                    <div class = "d-flex justify-content-center mb-2">
                                        <span class="badge bg-secondary">${user.spent/100}</span>
                                    </div>
                                    <div class = "bar ms-auto me-auto mb-3" style="height: ${inPixel}px;background:${user.color};"></div>
                                    <div>
                                    <div class = "stats-img-wrap bg-white p-1 shadow rounded-circle">
                                      <img class = "rounded-circle" src = "/img/${user.id}.jpg">
                                    </div>
                              </div>`)
    });
}
