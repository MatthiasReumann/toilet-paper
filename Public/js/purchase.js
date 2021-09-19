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
