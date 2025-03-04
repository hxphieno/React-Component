import React, {Component} from 'react';

interface FloatingPoppingWindowProps {
    //元素左上角坐标
    x: number;
    y: number;
    //悬浮窗大小
    width: number;
    height: number;
    //传入的元素种类
    contentType: string;//"Poster", "Text", "Mix"
    text?: string;
    imgPath?: string;
    targetRoute: string;
}

interface FloatingPoppingWindowState {
    isVisible: boolean;
    isDragging: boolean;
    position: { x: number, y: number };
    initialClick: { x: number, y: number };
}

class FloatingPoppingWindow extends Component<FloatingPoppingWindowProps, FloatingPoppingWindowState> {

    private dragRef: HTMLDivElement | null ;

    constructor(props: FloatingPoppingWindowProps) {
        super(props);
        this.state = {
            isVisible: true,
            isDragging: false,
            position: {x: this.props.x, y: this.props.y},
            initialClick: {x: 0, y: 0},
        };
    }

    handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === this.dragRef) {
            this.setState({
                isDragging: true,
                initialClick: {x: e.clientX, y: e.clientY}
            })
            e.preventDefault()
        }
    }
    handleMouseMove = (e: React.MouseEvent) => {
        if (this.state.isDragging) {
            const deltaX = e.clientX - this.state.initialClick.x;
            const deltaY = e.clientY - this.state.initialClick.y;

            this.setState({
                initialClick: {x: e.clientX, y: e.clientY},
                position: {
                    x: this.state.position.x + deltaX,
                    y: this.state.position.y + deltaY
                }
            })
        }

    }
    handleMouseUp = () => {
        this.setState({
            isDragging: false
        })
    }
    handleMouseLeave = () => {
        this.setState({isDragging: false}); // 鼠标移出组件时结束拖动
    };
    handleCloseWindow=()=>{
        this.setState({isVisible:false})
    }


    render() {

        return this.state.isVisible ?
            <div
                ref={(ref) => (this.dragRef = ref)}
                className=" bg-[rgb(219,211,232)] box-border p-0.5" style={{
                position: "absolute",
                width: this.props.width,
                height: this.props.height,
                transform: `translate(${this.state.position.x}px,${this.state.position.y}px)`,
                cursor: this.state.isDragging ? 'grabbing' : 'grab'

            }}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                onMouseLeave={this.handleMouseLeave}
            >

                <div className="bg-[rgb(103,46,213)]">
                    {this.props.text}
                </div>

            </div>
            : null;
    }

}

export default FloatingPoppingWindow;