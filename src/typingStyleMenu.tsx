import {Component} from 'react';

interface TypingStyleMenuProps {
    text: string[];
    imgPath: string[];//数量应同上文对应
    speed: number;
}

interface TypingStyleMenuState {
    text: string[];
    stringIndex: number;
    charIndex: number;
}

interface ResponsiveButtonProps {
    text: string;
    imgPath: string;
    targetRoute: string;
}

interface ResponsiveButtonState {
    isMouseOn: boolean;
}

class TypingStyleMenu extends Component<TypingStyleMenuProps, TypingStyleMenuState>{
    constructor(props: TypingStyleMenuProps) {
        super(props);
        this.state={
            text:[],
            stringIndex:0,
            charIndex:0,
        }
    }
    componentDidMount(): void {
        const strs = this.props.text;
        const interval = setInterval(() => {
            if(this.state.stringIndex<strs.length){
                const s=strs[this.state.stringIndex];
                const partialString=s.slice(0,this.state.charIndex+1);
                const newText=this.state.text;
                if(newText[this.state.stringIndex]){
                    newText[this.state.stringIndex]=partialString;
                }
                else{
                    newText.push(partialString);
                }
                if(this.state.charIndex>=strs[this.state.stringIndex].length-1){
                    this.setState({
                        charIndex:0,
                        stringIndex:this.state.stringIndex+1,
                        text:newText,
                    });
                }
                else {
                    this.setState({
                        charIndex:this.state.charIndex+1,
                        text:newText
                    });
                }
            }else{
                clearInterval(interval);
            }
        },this.props.speed*1000)

    }



    render(){
        return <div className="text-left">
            <ul>
                {this.state.text.map((item,index)=>(
                    <li key={item}>
                        <ResponsiveButton text={this.state.text[index]} imgPath={""} targetRoute={""}></ResponsiveButton>
                    </li>
                ))}
            </ul>
        </div>
    }
}

class ResponsiveButton extends Component<ResponsiveButtonProps, ResponsiveButtonState>{
    constructor(props: ResponsiveButtonProps) {
        super(props);
        this.state={
            isMouseOn: false,
        }
    }
    handleMouseEnter=()=>{
        this.setState({isMouseOn: true});
    }
    handleMouseLeave = () => {
        this.setState({isMouseOn: false});
    }
    render() {
        return (<div
            className="relative inline-block"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
        >
            {this.props.text}
            <div
                className={`absolute top-2 left-2 h-5 bg-red-500 transition-all duration-300 ease-in-out ${
                    this.state.isMouseOn ? 'w-full' : 'w-0'
                }`
            }
                style={{zIndex:-1}}
            ></div>

        </div>);
    }
}

export default TypingStyleMenu;