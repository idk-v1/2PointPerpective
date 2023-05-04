class Rect
{
    constructor(x, y, hsl)
    {
        this.ft = new Point(x, y);
        this.fb = new Point(x, y);

        this.lt = new Point(x, y);
        this.lb = new Point(x, y);

        this.rt = new Point(x, y);
        this.rb = new Point(x, y);

        this.stage = 1;

        this.color = hsl;
    }

    updatePos(clickX, clickY, width)
    {
        var slope;

        switch (this.stage)
        {
        case 1:
            if (clickY > this.ft.y)
            {
                slope = clickY / this.ft.x;
                this.fb = new Point(this.ft.x, clickY);
            }
            break;
        case 2:
            if (clickX < this.ft.x)
            {
                slope = this.ft.y / this.ft.x;
                this.lt = new Point(clickX, slope * clickX);

                slope = this.fb.y / this.ft.x;
                this.lb = new Point(clickX, slope * clickX);
            }
            else
            {
                this.lt = this.ft;
                this.lb = this.fb;
            }
            break;
        case 3:
            if (clickX > this.ft.x)
            {
                slope = this.ft.y / (this.ft.x - width);
                this.rt = new Point(clickX, slope * (clickX - width));

                slope = this.fb.y / (this.ft.x - width);
                this.rb = new Point(clickX, slope * (clickX - width));
            }
            else
            {
                this.rt = this.ft;
                this.rb = this.fb;
            }
            break;
        }
    }

    draw(ctx, hor)
    {
        var int;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#f00";
        switch (this.stage + 1)
        {
        case 5: // Done
            ctx.strokeStyle = (dark ? "#fff" : "#000");
        case 4: // Right
            ctx.beginPath();
            ctx.moveTo(this.ft.x, hor + this.ft.y);
            ctx.lineTo(this.rt.x, hor + this.rt.y);
            ctx.lineTo(this.rb.x, hor + this.rb.y);
            ctx.lineTo(this.fb.x, hor + this.fb.y);

            if (this.fb.y < 0)
            {
                int = intersect(this.lb, this.rb);
                ctx.moveTo(this.rb.x, hor + this.rb.y);
                ctx.lineTo(int.x, hor + int.y);
                ctx.lineTo(this.lb.x, hor + this.lb.y);
                ctx.lineTo(this.fb.x, hor + this.fb.y);
            }
            else if (this.ft.y > 0)
            {
                int = intersect(this.lt, this.rt);
                ctx.moveTo(this.rt.x, hor + this.rt.y);
                ctx.lineTo(int.x, hor + int.y);
                ctx.lineTo(this.lt.x, hor + this.lt.y);
                ctx.lineTo(this.ft.x, hor + this.ft.y);
            }

            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = (dark ? "#fff" : "#000");
        case 3: // Left
            ctx.beginPath();
            ctx.moveTo(this.ft.x, hor + this.ft.y);
            ctx.lineTo(this.lt.x, hor + this.lt.y);
            ctx.lineTo(this.lb.x, hor + this.lb.y);
            ctx.lineTo(this.fb.x, hor + this.fb.y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = (dark ? "#fff" : "#000");
        case 2: // Bottom
            ctx.beginPath();
            ctx.moveTo(this.ft.x, hor + this.ft.y);
            ctx.lineTo(this.fb.x, hor + this.fb.y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.strokeStyle = (dark ? "#fff" : "#000");
        }
    }
}