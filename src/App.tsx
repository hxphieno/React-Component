import './App.css'
import TypingStyleMenu from "./typingStyleMenu.tsx";
import FloatingPoppingWindow from "./floatingPoppingWindows.tsx";

function App() {
  return (
    <>
    <div className='w-screen h-screen flex flex-col justify-center'>
      <div className='flex flex-row'>
        <TypingStyleMenu text={["这是","一个","组件演示","鼠标","移动过来","有动画"]} imgPath={[]} speed={0.1}></TypingStyleMenu>
      </div>
      <FloatingPoppingWindow
          x={100}
          y={100}
          width={200}
          height={100}
          contentType="Text"
          text="这是一个悬浮窗"
          targetRoute="/"
      />
    </div>
        
    </>
  )
}

export default App
