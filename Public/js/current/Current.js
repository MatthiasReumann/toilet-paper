const Current = {
    id: null,
    
    render: function(){
        const btn = $("#add-purchase-modal-button");
        
        if(this.id === null) {
            btn.prop("disabled", true);
        }else{
            btn.prop("disabled", false);
            
            $("#form-add-purchase input[name='item-member']").val(this.id); // set value
            $("#current-member-picture").attr("src", `img/${this.id}.jpg`);// set profile picture
        }
    },
    
    getCurrentMember: function(){
        return localStorage.getItem("currentMember");
    },

    setCurrentMember: function(user){
        localStorage.setItem("currentMember", user.id);
        this.id = user.id;
        this.render();
    },
    
    init: function(){
        this.id = this.getCurrentMember();
        this.render();
    }
};
