//#region poinerEvents

var evCache = new Array();
var prevDiff = -1;

let currentGesture = null;

const webcam = document.getElementById('webcam');

let nodeState = {
    imageWidth: webcam.x,
    scale: 1.8,
    lastX: 0
};

webcam.addEventListener('pointerdown', pointDown);
webcam.addEventListener('pointerup', cancelTouch);
webcam.addEventListener('pointercancel', cancelTouch);
webcam.addEventListener('pointermove', move);
webcam.onpointerout = cancelTouch;
webcam.onpointerleave = cancelTouch;

function move(event) {
    if (!currentGesture) {
        return
    }
    event.preventDefault();
    console.log("move", event);

    const { startX } = currentGesture;
    const { x } = event;

    if (evCache.length == 1) {
        const dx = x - startX;
        webcam.style.transform = `
            translateX(${nodeState.lastX + dx}px)
            scale(${nodeState.scale})`;
        nodeState.lastX = dx;
    }

    for (var i = 0; i < evCache.length; i++) {
        if (event.pointerId == evCache[i].pointerId) {
            evCache[i] = event;
            break;
        }
    }

    if (evCache.length == 2) {
        let curDiff = Math.abs(evCache[0].clientX - evCache[1].clientX);
        if (prevDiff > 0) {
            if (curDiff > prevDiff) {
                nodeState.scale *= curDiff / prevDiff;
                webcam.style.transform = `translateX(${nodeState.lastX}px) scale(${nodeState.scale})`;
            }
            if (curDiff < prevDiff) {
                nodeState.scale *= curDiff / prevDiff;
                webcam.style.transform = `translateX(${nodeState.lastX}px) scale(${nodeState.scale})`;
            }
        }
        prevDiff = curDiff;
    }
}

function cancelTouch(event) {
    console.log("up", event);
    currentGesture = null;
    remove_event(event);
    if (evCache.length < 2) prevDiff = -1;
}

function pointDown(event) {
    console.log("down", event);
    evCache.push(event);
    webcam.setPointerCapture(event.pointerId);
    currentGesture = {
        startX: event.x,
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
