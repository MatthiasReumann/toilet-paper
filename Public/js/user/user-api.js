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
        UserList.setUsers(users);
        Current.render();
    }).fail(() => {
        console.error("GET /users failed.");
    }).then(() => {
        updateStats();
    })
}

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
