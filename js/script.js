//#region poinerEvents

let evCache = new Array();
let prevDiff = -1;

let currentGesture = null;

const webcam = document.getElementById('webcam');

const nodeState = {
    imageWidth: webcam.x * 2,
    scale: 1.8
};

webcam.addEventListener('pointerdown', pointDown);
webcam.addEventListener('pointerup', cancelTouch);
webcam.addEventListener('pointercancel', cancelTouch);
webcam.addEventListener('pointermove', move);

function move (event) {
    if (!currentGesture) {
        return
    }
    event.preventDefault();
    console.log("move", event);

    const {startX, startPosition} = currentGesture;
    const {x} = event;
    const dx = x - startX;
    if (startPosition >= -nodeState.imageWidth && startPosition <= nodeState.imageWidth)
        webcam.style.transform = `translateX(${dx}px) scale(${nodeState.scale})`;
    currentGesture.startPosition = dx;

    for (var i = 0; i < evCache.length; i++) {
        if (event.pointerId == evCache[i].pointerId) {
            evCache[i] = event;
            break;
        }
    }

    if (evCache.length == 2) {
        // Calculate the distance between the two pointers
        var curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);

        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                console.log("Pinch moving OUT -> Zoom in", event);
                webcam.style.transform = `translateX(${startPosition}px) scale(${2})`;
            }
            if (curDiff < prevDiff) {
                console.log("Pinch moving IN -> Zoom out", event);
                webcam.style.transform = `translateX(${startPosition}px) scale(${0.5})`;
            }
        }
        prevDiff = curDiff;
    }
}

function cancelTouch (event) {
    console.log("up", event);
    currentGesture = null;
    remove_event(event);
    if (evCache.length < 2) prevDiff = -1;
}

function pointDown (event) {
    console.log("down", event);
    evCache.push(event);
    webcam.setPointerCapture(event.pointerId);
    currentGesture = {
        startX: event.x,
        startPosition: webcam.style.objectPosition.split('px')[0]
    };
}

function remove_event(ev) {
    for (var i = 0; i < evCache.length; i++) {
        if (evCache[i].pointerId == ev.pointerId) {
            evCache.splice(i, 1);
            break;
        }
    }
}

//#endregion region
