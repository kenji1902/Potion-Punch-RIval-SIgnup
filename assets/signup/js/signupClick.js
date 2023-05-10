$(document).ready(function () {
    let signupBtn = $("#signup");
    $(signupBtn).click(function (e) { 
        e.preventDefault();
        $.when(
            
            $("#signup-container").addClass("slide-out-top").promise() 
        
        ).then(()=>{
            
            let deferred = new $.Deferred();
            let hidePromise = setTimeout(()=>{
                $("#signup-container").addClass("hidden");
                $("#forms-container").removeClass("hidden");
            },500);
            deferred.resolve(hidePromise)
            return deferred.promise();
        
        
        }).then(
            
            $("#forms-container").addClass("slide-in-bottom").promise()

        ).then( () =>{

            setInterval(() => {
                $("#forms-container").removeClass("overflowHidden")
            },1000);

        })
        
    });
});