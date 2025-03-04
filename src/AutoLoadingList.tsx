import axios, {AxiosInstance} from 'axios';
import React, {Component} from "react";


interface RawStory{
    image_hue:string;
    title:string;
    url:string;
    hint:string;
    ga_prefix:string;
    images:string[];
    type?:number;
    id?:number;
}

interface RawTopStory{
    image_hue:string;
    hint:string;
    url:string;
    image:string;
    title:string;
    ga_prefix:string;
    type?:number;
    id?:number;
}


interface Story{
    title: string,
    url: string,
    hint: string,
    image: string,
    imageHue: string,
}

interface Daily{
    date:string;
    topStories: Story[];
    stories: Story[];
}


const ZhihuApi=():AxiosInstance=>{
    return axios.create({
        baseURL:'/api/news',
        timeout:5000,
    })
}

// const formatDate= (date:Date):string=>{
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}${month}${day}`;
// }
function subtractOneDay(dateStr: string) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10)-1;
    const day = parseInt(dateStr.substring(6, 8), 10)+1;
    console.log(year, month, day);
    const date = new Date(year, month, day);
    date.setDate(date.getDate() - 2);
    console.log(date);
    const newYear = date.getFullYear().toString();
    const newMonth = String(date.getMonth()+1).padStart(2, '0'); // 月份从 0 开始，需加 1
    const newDay = String(date.getDate()).padStart(2, '0'); // 保证两位数
    return `${newYear}${newMonth}${newDay}`;
}
const ZhihuService={
    async getTodayNews():Promise<Daily>{
        const response = await ZhihuApi().get('/latest');
        const data=response.data;
        return {
            date: data.date,
            stories: data.stories.map((story: RawStory) => ({
                title: story.title,
                url: story.url,
                hint: story.hint,
                image: story.images[0],
                imageHue: story.image_hue,
            })),
            topStories: data.top_stories.map((topStory: RawTopStory) => ({
                title: topStory.title,
                url: topStory.url,
                hint: topStory.hint,
                image: topStory.image,
                imageHue: topStory.image_hue
            }))
        };
    },

    async getBeforeNews(date:string):Promise<Story[]>{
        console.log(date);
        const response = await ZhihuApi().get(`/before/${date}`);
        const data=response.data;
        return data.stories.map((story: RawStory) => ({
            title: story.title,
            url: story.url,
            hint: story.hint,
            image: story.images[0],
            imageHue: story.image_hue,
        }))
        ;
    }
}

interface AutoLoadingListState{
    stories: Story[];
    isLoading:boolean;
    date:string;
    hasMore:boolean;
}

class AutoLoadingList extends Component<object, AutoLoadingListState>{
    private listRef: React.RefObject<HTMLDivElement>;
    constructor() {
        super({});
        this.state = {
            stories:[],
            date:"",
            isLoading:false,
            hasMore:false,
        }
        this.handleScroll = this.handleScroll.bind(this)
        this.listRef = React.createRef()
    }
    //第一次加载
    async componentDidMount() {
        await this.onRefresh();
        this.listRef.current?.addEventListener("scroll", this.handleScroll);
    }


    componentWillUnmount() {
        this.listRef.current?.removeEventListener('scroll', this.handleScroll); // 组件卸载时移除事件监听器
    }

    handleScroll() {
        const { isLoading, hasMore } = this.state;
        if (isLoading || !hasMore) return;

        const container = this.listRef.current;
        if (!container) return;

        // 判断容器是否滚动到底部
        const { scrollTop, clientHeight, scrollHeight } = container;
        const isBottom = scrollTop + clientHeight >= scrollHeight - 20;
        console.log(isBottom);
        if (isBottom) {
            this.loadMore();
        }
    }


    async onRefresh(){
        if(this.state.isLoading)return;
        this.setState({
            isLoading:true
        })
        try{
            const daily = await ZhihuService.getTodayNews();
            console.log(daily);
            this.setState({
                stories:[...daily.topStories,...daily.stories],
                date:daily.date,
                isLoading:false,
                hasMore:true
            })
        }
        catch(error){
            console.log("不太好");
            console.log(error);
            this.setState({isLoading:false})
        }
    }

    loadMore = async () =>{
        console.log("1111")
        if(this.state.isLoading || !this.state.hasMore)return;
        this.setState({
            isLoading:true,
            date:subtractOneDay(this.state.date)
        });
        try{
            const daily = await ZhihuService.getBeforeNews(this.state.date);
            this.setState(prevState => ({
                stories: [...prevState.stories, ...daily],
                hasMore: daily.length > 0,
                isLoading: false
            }));
        }catch(error){
            console.log("不太好");
            console.log(error);
            this.setState({isLoading:false})
        }
    }


    render() {
        return (<div
                ref={this.listRef}
                style={{ height: "500px", overflowY: "auto" }}>
            <div

                 onClick={this.loadMore}
            >Zhihu</div>
            <ul>
                {this.state.stories.map((item,index)=>(
                    <li key={index}>{item.title}</li>
                ))}
            </ul>
            {this.state.isLoading?<div>Loading...</div>:null}
        </div>);
    }
}

export default AutoLoadingList;