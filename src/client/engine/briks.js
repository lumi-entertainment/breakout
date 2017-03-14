"use strict";

/**
 * @summary
 * @since 1.5.0
 * @author Dario Olivini <d.olivini@cogenspa.com>
 * @license Proprietary - See file 'LICENSE.md' in this project.
 */

function Brick(width, height, value, color) {
    this.type = "Brick";
    this.width = width;
    this.height = height;
    this.color = color;
    this.textColor = U.Graph.invertColor(this.color);
    this.status = 1;

    this.value = value;

    this.x = 0;
    this.y = 0;
}

Brick.prototype = {
    draw: function (ctx, x, y) {
        if (this.status === 1) {
            this.x = x;
            this.y = y;
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.font = "12px Arial";
            ctx.fillStyle = this.textColor;
            ctx.fillText(this.value, this.x - 5 + this.width / 2, this.y + 5 + this.height / 2);
            ctx.closePath();
        }
    }
}