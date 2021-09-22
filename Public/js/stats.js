function getStats(){
    const stats = {
        total: 0,
        users: []
    }
    UserList.list.forEach((user) => {
        let spent = 0;
        
        user.purchases.forEach((purchase) => {
            spent += purchase.priceInCent * purchase.amount;
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

