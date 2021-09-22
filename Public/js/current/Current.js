const Current = {
    id: null,
    
    render: function(){
        const btn = $("#add-purchase-modal-button");
        const profilePicture = $("#profile-picture");
        
        if(this.id === null) {
            btn.prop("disabled", true);
            profilePicture.addClass("d-none");
        }else{
            btn.prop("disabled", false);
            profilePicture.removeClass("d-none");
            
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
    
    unsetCurrentMember: function(user){
        if(this.id !== null && user.id === this.id){
            localStorage.removeItem("currentMember");
            this.id = null;
            this.render();
        }
    },
    
    init: function(){
        this.id = this.getCurrentMember();
        this.render();
    }
};
