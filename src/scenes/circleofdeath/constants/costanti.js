export const costanti = {
    raggio: 270,
    REDTRACE: "red",
    BLACKTRACE: "black",
    minNumRifleAim: 15,
    maxNumRifleAim: 22,
    MIN_DIST_BETWEEN_AIMS: 3
}

export function calculatePointCircumference_X(canvasW, angolo) {
    return (canvasW / 2) + costanti.raggio * Math.cos(angolo);

}

export function calculatePointCircumference_Y(canvasH, angolo) {
    return canvasH / 2 + costanti.raggio * Math.sin(angolo);
}


export function findNotUsedRandomAngle(arrAngles) {

    let safeAngleFound = false;
    let angleFound;
    let attempts = 0

    while (!safeAngleFound && attempts < 100) {
        attempts++

        angleFound = Math.random() * (2 * Math.PI);

        if (arrAngles.length === 0) {
            break;
        }

        arrAngles.some(existingAngle => {
            if (Math.abs(angleFound - existingAngle) < costanti.MIN_DIST_BETWEEN_AIMS) {
                console.log("distanza troppo piccola. tenta di nuovo.")
            } else {
                safeAngleFound = true
            }
        })

    }

    return angleFound
}

export function updateGameTimer(b, c, d, gameTimer, timerRef) {
    if (d === 9) {
        c++;
        d = 0
        refreshTime(b, c, d, gameTimer, timerRef)
        return
    }

    if (c === 5) {
        b++
        c = 0
        d = 0;
        refreshTime(b, c, d, gameTimer, timerRef)
        return
    }

    d++
    refreshTime(b, c, d, gameTimer, timerRef)
    console.log(gameTimer)

}

function refreshTime(b, c, d, gameTimer, timerRef) {
    gameTimer = `${b}:${c}${d}`;
    timerRef.setText(gameTimer)

}