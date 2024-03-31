window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}

function syncVideos() {
  const first = document.getElementById('tennis_orig');
  const second = document.getElementById('tennis_pose');
  const third = document.getElementById('tennis_nvs')

  // keep track of if video's seeking to avoid constant changes to position
  // don't know if this is really necessary
  let isSeeking = false;
  second.addEventListener('seeking', () => isSeeking = true);
  second.addEventListener('seeked', () => isSeeking = false);

  const thresholdMilliseconds = 50; // some ms threshold of difference to avoid excessive seeking
  const nudgeOffsetMilliseconds = 5; // just a guess that you may need to assume that seeking won't be instantaneous. I don't know if this is necessary or helpful

  // listen for time updates on the first video's position
  first.addEventListener('timeupdate', () => {
      const deltaMilliseconds = (second.currentTime - first.currentTime) * 1000;
      if (Math.abs(delta) >= thresholdMilliseconds) {
          if (isSeeking) {
              console.warn('not in sync, but currently seeking');
              return;
          }
          console.log(`out of sync by ${deltaMilliseconds}ms. Seeking to ${first.currentTime}`);

          // adding a bit of nudge b/c syncing may not be instant. Not an exact science...for that use MSE
          second.currentTime = first.currentTime + nudgeOffsetMilliseconds;
      }
  });
  isSeeking = false;
  third.addEventListener('seeking', () => isSeeking = true);
  third.addEventListener('seeked', () => isSeeking = false);

  first.addEventListener('timeupdate', () => {
    const deltaMilliseconds = (third.currentTime - first.currentTime) * 1000;
    if (Math.abs(delta) >= thresholdMilliseconds) {
        if (isSeeking) {
            console.warn('not in sync, but currently seeking');
            return;
        }
        console.log(`out of sync by ${deltaMilliseconds}ms. Seeking to ${first.currentTime}`);

        // adding a bit of nudge b/c syncing may not be instant. Not an exact science...for that use MSE
        third.currentTime = first.currentTime + nudgeOffsetMilliseconds;
    }
});
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();
    syncVideos();

})
