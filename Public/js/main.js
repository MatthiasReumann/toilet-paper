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
