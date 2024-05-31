
var ctx;

export function init(context) {
    ctx = context;
}

export function rect(x, y, width, height, r, g, b, a, fill = true){
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    }
    else{
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

export function circle(x, y, radius, r, g, b, a, fill = true, thickness = 2){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    if (fill){
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fill();
    }
    else{
        ctx.lineWidth = thickness;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.stroke();
    }
}

export function line(sx, sy, ex, ey, r, g, b, a, thickness){
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.stroke();
}

export function drawImage(image, x, y, w, h) {
    ctx.drawImage(image, x, y, w, h);
}

export function clearScreen(r, g, b, a){
    rect(0, 0, window.screen.width, window.screen.height, r, g, b, a);
}