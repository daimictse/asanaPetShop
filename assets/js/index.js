$(document).ready(function(){
    
    // calculate how many images to load normally 
    // according to the window size upon window load
    var numImageOnRow = Math.ceil((window.innerHeight - 250) / 300);
    var numImageOnColumn = Math.ceil(window.innerWidth / 230);
    var numOfImageToLoadNormally = numImageOnRow * numImageOnColumn;

	$("#header").load("./assets/snippets/header.html");
	$("#footer").load("./assets/snippets/footer.html");
	
	// load dogs images
	$.getJSON("./assets/data/dogs.json", function(data){
        $.each(data, function(key, val){
            for (var i=0; i<val.length; i++) {
                var dogNum = i+1;
                if (i<numOfImageToLoadNormally) {
                    $("section").append("<div class='imageItem'><img src='." + val[i].image + "' alt='dog" + dogNum + "'></div>");
                } else {  
                    // lazy load images 
                    $("section").append("<div class='imageItem'><img class='lazy' data-src='." + val[i].image + "' alt='dog" + dogNum + "'></div>");
                }
                    
            }  
        });
    });

    function runAfterLoadCompleted() {
        // load dog image in full scale when a thumbnail got clicked
        $('section').on('click', 'img' , function() {

            // get the image that got clicked
            var theImage = new Image();
            theImage.src = $(this).attr("src");
            theImage.onload = function() {
                var winWidth = theImage.width + 10;
                var winHeight = theImage.height + 10;

                window.open(theImage.src,  null, 'height=' + winHeight + ', width=' + winWidth + ', toolbar=0, location=0, status=0, scrollbars=0, resizable=0');
            };
        });

        var lazyloadImages = document.querySelectorAll("img.lazy");    
        var lazyloadThrottleTimeout;
          
        function lazyload () {
            if(lazyloadThrottleTimeout) {
              clearTimeout(lazyloadThrottleTimeout);
            }    
            
            lazyloadThrottleTimeout = setTimeout(function() {
                var scrollTop = window.pageYOffset;
                lazyloadImages.forEach(function(img) {
                    if(img.offsetTop < (window.innerHeight + scrollTop)) {
                      img.src = img.dataset.src ? img.dataset.src : img.src;
                      img.classList.remove('lazy');
                    }
                });
                if(lazyloadImages.length === 0) { 
                  document.removeEventListener("scroll", lazyload);
                  window.removeEventListener("resize", lazyload);
                  window.removeEventListener("orientationChange", lazyload);
                }
            }, 20);
        }
          
        document.addEventListener("scroll", lazyload);
        window.addEventListener("resize", lazyload);
        window.addEventListener("orientationChange", lazyload);
    }  

    $( document ).ajaxStop(function() {
        runAfterLoadCompleted();
    });
});
