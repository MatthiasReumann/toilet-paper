const hidePurchaseModal = () => hideModal("#add-purchase-modal");

// POST /users
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

// GET /users
function listUsers(){
    $.get("/users", (users) => {
        UserList.setUsers(users);
        Current.render();
    }).fail(() => {
        console.error("GET /users failed.");
    });
}

// PUT /users/:id
function updateUser(user, i){
    const form = $(`#form-edit-user-${i}`)[0];
    const formData = new FormData(form);
    const formElements = $(`#form-edit-user-${i} :input`);
    const btn = $("#edit-user-button");
    
    formElements.prop("disabled", true);
    
    btn.html(`<div class="spinner-border spinner-border-sm mt-1 mb-1 text-light" role="status">
                <span class="visually-hidden">Updating...</span>
             </div>`)
    
    $.ajax({
        url: `/users/${user.id}`,
        type: "PUT",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        success: (res) => {
            hideUserListModal();
            listUsers();
            formElements.prop("disabled", false);
            btn.html("Update")
        }
    });
}

// DELETE /users/:id
function deleteUser(user){
    if(confirm(`Do you really want to delete user '${user.name}'?`)){
        $.ajax({
            url: `/users/${user.id}`,
            type: "DELETE",
            success: (data) => {
                hideUserListModal();
                listUsers();
                
                Current.unsetCurrentMember(user);
            },
            error: (err) => console.err(`DELETE /users/${user.id} failed`)
        })
    }
}

// POST /users/:id/purchases
function addPurchase(){
    const formElements = $("#form-add-purchase :input");
    formElements.prop("disabled", true);
    
    const body = {
        name: $("input[name='item-name']").val(),
        priceInCent: $("input[name='item-price']").val() * 100,
        amount: $("input[name='item-amount']").val()
    };
    
    const uid = $("input[name='item-member']").val();
    $.post(`/users/${uid}/purchases`, body, function(data){
        listUsers();
        hidePurchaseModal();
    })
    .fail(() => console.error("POST /purchases failed."))
    .then(() => formElements.prop("disabled", false));
}

// DELETE /users/:id/purchases/:pid
function deletePurchase(purchase){
    if (confirm(`Are you sure you want to delete '${purchase.name}'?`))  {
        $.ajax({
            url: `/users/${purchase.uid}/purchases/${purchase.id}`,
            type: 'DELETE',
            complete: function(result) {
                listUsers();
            },
            error: (err) => console.log(`DELETE /users/${purchase.uid}/purchases/${purchase.id} failed`)
        });
    }
}

