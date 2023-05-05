class Rect
{
    constructor(x, y, color)
    {
        this.ft = new Point(x, y);
        this.fb = new Point(x, y);

        this.lt = new Point(x, y);
        this.lb = new Point(x, y);

        this.rt = new Point(x, y);
        this.rb = new Point(x, y);

        this.stage = 1;

        this.color = color;

        this.show = false;
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

    draw(ctx, width, hor)
    {
        var first = true;
        var int;
        ctx.fillStyle = `hsl(${this.color}, 50%, 50%)`;
        ctx.strokeStyle = `hsl(${this.color}, 100%, ${dark * 25 + 25}%)`;
        switch (this.stage + 1)
        {
        case 5: // Done
            if (first)
            {
                ctx.strokeStyle = (dark ? "#fff" : "#000");
                first = false;
            }
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

            if (first)
            {
                ctx.strokeStyle = (dark ? "#fff" : "#000");
                first = false;
            }
        case 3: // Left
            ctx.beginPath();
            ctx.moveTo(this.ft.x, hor + this.ft.y);
            ctx.lineTo(this.lt.x, hor + this.lt.y);
            ctx.lineTo(this.lb.x, hor + this.lb.y);
            ctx.lineTo(this.fb.x, hor + this.fb.y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            if (first)
            {
                ctx.strokeStyle = (dark ? "#fff" : "#000");
                first = false;
            }
        case 2: // Bottom
            ctx.beginPath();
            ctx.moveTo(this.ft.x, hor + this.ft.y);
            ctx.lineTo(this.fb.x, hor + this.fb.y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();

            if (first)
            {
                ctx.strokeStyle = (dark ? "#fff" : "#000");
                first = false;
            }
        }

        ctx.strokeStyle = "#8888";
        ctx.beginPath();
        switch (this.stage + 1)
        {
            case 5:
                if (!this.show)
                    break;
            case 4:
                if (this.ft.y > 0)
                {
                    ctx.moveTo(this.rt.x, hor + this.rt.y);
                    ctx.lineTo(0, hor);
                }
                else if (this.fb.y < 0)
                {
                    ctx.moveTo(this.rb.x, hor + this.rb.y);
                    ctx.lineTo(0, hor);
                }

            case 3:
                if (this.ft.y > 0)
                {
                    ctx.moveTo(this.lt.x, hor + this.lt.y);
                    ctx.lineTo(width, hor);
                }
                else if (this.fb.y < 0)
                {
                    ctx.moveTo(this.lb.x, hor + this.lb.y);
                    ctx.lineTo(width, hor);
                }

            case 2:
                ctx.moveTo(0, hor);
                ctx.lineTo(this.fb.x, hor + this.fb.y);
                ctx.lineTo(width, hor);

            case 1:
                ctx.moveTo(0, hor);
                ctx.lineTo(this.ft.x, hor + this.ft.y);
                ctx.lineTo(width, hor);
        }
        ctx.stroke();
        ctx.closePath();
    }
}