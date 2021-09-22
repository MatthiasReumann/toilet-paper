const UserList = {
    list: [],
    purchases: [],
    
    render: function() {
        this.renderUserList();
        this.renderPurchases();
    },
    
    renderUserList: function() {
        const ul = $("#users-list");
        const addPurchaseModalButton = $("#add-purchase-modal-button");
        const showUserListButton = $("#show-users-list-button");
        const current_id = Current.getCurrentMember();
        
        $("#users-list li").remove();
        
        if(this.list.length === 0){
            addPurchaseModalButton.prop("disabled", true);
            showUserListButton.prop("disabled", true);
            return;
        }
        
        addPurchaseModalButton.prop("disabled", false);
        showUserListButton.prop("disabled", false);
        
        this.list.forEach((user, i) => {
           const show = current_id === user.id ? "" : "d-none";
            
           ul.append(`<li class="list-group-item list-group-item-action">
                        <div class = "d-flex">
                            <div class = "mt-auto mb-auto me-auto">
                                 <span class = "mt-auto mb-auto">${user.name}</span>
                                 <span class = "${show} itsme mt-auto mb-auto fs-6"><i class="bi bi-person"></i></span>
                            </div>
                            <div class = "d-flex mt-auto mb-auto">
                                <button id = "btn-edit-${i}" class = "edit mt-auto mb-auto me-3 type="button" data-bs-toggle="collapse" data-bs-target="#edit-${i}" aria-expanded="false" aria-controls="edit-${i}">
                                        <i class="bi bi-pen"></i>
                                </button>
                                <span class = "del mt-auto mb-auto fs-3"><i class="bi bi-x"></i></span>
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
                     </li>`);
            
            ul.find(".list-group-item-action").get(i).onclick = () => {
                Current.setCurrentMember(user);
                ul.find(".itsme").addClass("d-none");
                ul.find(".itsme").get(i).classList.remove("d-none");
            };
            ul.find(".del").get(i).onclick = () => deleteUser(user);
            ul.find(".edit").get(i).onclick = () => onUserEditClick(user, i);
            
            $(`#form-edit-user-${i}`).submit((e) => {
                e.preventDefault();
                updateUser(user, i);
                event.target.reset()
            });
        });
    },
    
    renderPurchases: function(purchases){
        $('#purchases li').remove();
        
        const purchasesHeader = $("#purchases-header");
        
        if(this.purchases.length === 0){
            purchasesHeader.html("No purchases yet.");
            return;
        }
        
        purchasesHeader.html("Last 5 Purchases");
        
        const limited = this.purchases.reverse().slice(0,5);
        
        limited.forEach((purchase, i) => {
            const ul = $("#purchases").append(`<li class = "position-relative list-group-item d-flex justify-content-between align-items-start">
                                                  <div class="ms-2 me-auto mt-auto mb-auto">
                                                      <h6 class="m-0 fw-bold">${purchase.name}</h6>
                                                      ${purchase.priceInCent/100}
                                                  </div>
                                                  <span class="badge bg-black rounded-pill mt-auto mb-auto me-3">#${purchase.amount}</span>
                                                  <span class = "del fs-1 mt-auto mb-auto"><i class="bi bi-x"></i></span>
                                              </li>`);
            ul.find(".del").get(i).onclick = () => deletePurchase(purchase);
        });
    },
    
    setUsers: function(users){
        this.list = users;
        
        this.purchases = [];
        users.forEach((user) => {
           user.purchases.forEach(p => p.uid = user.id);
           this.purchases = this.purchases.concat(user.purchases);
        });
        
        this.render();
        Stats.update();
    },
    
    init: function(){
        listUsers();
    }
};

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

