const hidePurchaseModal = () => hideModal("#add-purchase-modal");

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
        listPurchases();
        hidePurchaseModal();
    })
    .fail(() => console.error("POST /purchases failed."))
    .then(() => formElements.prop("disabled", false));
}

function listPurchases(){
    $.get("/purchases", (purchases) => {
        PurchaseList.setPurchases(purchases);
    })
    .fail(() => console.error("GET /purchases failed."))
}

function deletePurchase(purchase, i){
    if (confirm(`Are you sure you want to delete '${purchase.name}'?`))  {
        $.ajax({
            url: "/purchases/" + purchase.id,
            type: 'DELETE',
            complete: function(result) {
                listPurchases();
            },
            error: (err) => console.log("DELETE /purchases/" + id + " failed.")
        });
    }
}
