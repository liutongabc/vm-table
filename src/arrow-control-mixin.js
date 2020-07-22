export default{
    computed:{
        //箭头定位在表头右侧中间
        arrowTop(){
            return this.titleHeight/2 - 8 + 'px';
        },
        leftArrow(){
            return this.translateX <= this.maxScrollWidth;
        }
    },

}