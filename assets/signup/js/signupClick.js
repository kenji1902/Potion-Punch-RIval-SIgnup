$(document).ready(function () {
    let signupBtn = $("#signup");
    $(signupBtn).click(function (e) { 
        e.preventDefault();
        $.when(
            
            $("#signup-container").addClass("slide-out-top").promise() 
        
        ).then(
            $(".monstronauts-body").addClass("overflowHidden").promise()
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
                $(".monstronauts-body").removeClass("overflowHidden")
            },1000);

        })
        
    });
    overscroll("#forms-container");
});

function overscroll(element) {
    $(element).on("scroll", function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(this).prop("scrollHeight");
        var offsetHeight = $(this).outerHeight();
            // console.log(`${scrollTop} + ${offsetHeight} == ${scrollHeight}`)
        if (scrollTop + offsetHeight >= scrollHeight-10) {
            console.log("End of scroll");
            $(element).addClass("overscroll");
        } else {
            $(element).removeClass("overscroll");
        }
    });
  }
  