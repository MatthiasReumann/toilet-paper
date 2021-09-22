$(document).ready(() => {
    onSubmit("#form-add-user", addUser);
    onSubmit("#form-add-purchase", addPurchase);
    Current.init();
    UserList.init();
});

function onSubmit(formid, action) {
    $(formid).submit((e) => {
        e.preventDefault();
        action();
        event.target.reset();
    });
}

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
let hideUserListModal = () => hideModal("#show-users-modal");
