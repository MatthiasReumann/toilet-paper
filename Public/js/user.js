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
