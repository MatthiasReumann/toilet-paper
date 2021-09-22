function search(q){
    $.get("/search?q="+q, (items)=>{
        showSearchResult(items);
    }).fail(() => console.log("GET /search?q="+q+" failed."));
}

function showSearchResult(items){
    clearSearchResults();
    
    const ul = $("#item-search-result");
    items.forEach((item, i) => {
        ul.append(`<li class = "d-flex list-group-item list-group-item-action">
                                    <span class = "me-auto">${item.name}</span>
                                    <span class="badge rounded-pill bg-success">${item.priceInCent/100}</span>
                                </li>`);
        
        ul.children().get(i).onclick = () => selectItem(item);
    });
}

function selectItem(item){
    $("input[name='item-name']").val(item.name);
    $("input[name='item-price']").val(item.priceInCent/100);
    $("input[name='item-id']").val(item.id);
    
    clearSearchResults();
}

function clearSearchResults(){
    $("#item-search-result li").remove();
}
