const PurchaseList = {
    list: [],
    
    render: function(purchases){
        $('#purchases li').remove();
        
        const purchasesHeader = $("#purchases-header");
        
        if(this.list.length === 0){
            purchasesHeader.html("No purchases yet.");
            return;
        }
        
        purchasesHeader.html("Last 5 Purchases");
        
        const limited = this.list.reverse().slice(0,5);
        
        limited.forEach((p, i) => {
            const ul = $("#purchases").append(`<li class = "position-relative list-group-item d-flex justify-content-between align-items-start">
                                                  <div class="ms-2 me-auto mt-auto mb-auto">
                                                      <h6 class="m-0 fw-bold">${p.name}</h6>
                                                      ${p.priceInCent/100}
                                                  </div>
                                                  <span class="badge bg-black rounded-pill mt-auto mb-auto me-3">#${p.amount}</span>
                                                  <span class = "del fs-1 mt-auto mb-auto"><i class="bi bi-x"></i></span>
                                              </li>`);
            ul.find(".del").get(i).onclick = () => deletePurchase(p, i);
        });
    },
    
    setPurchases: function(purchases){
        this.list = purchases;
        this.render();
    },
    
    init: function() {
        listPurchases();
    }
};
