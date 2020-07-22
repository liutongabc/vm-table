export default {
  data() {
      return {
        maxY: 0,
        maxX: 0,
        translateX: 0,
        translateY: 0,
        inertiaScrollTime: 0,
        bezier: 'linear',
        startY: 0,
        pointX: 0,
        pointY: 0,
        startTime: 0,                 // 惯性滑动范围内的 startTime
        momentumStartY: 0,            // 惯性滑动范围内的 startY
        momentumTimeThreshold: 300,   // 惯性滑动的启动 时间阈值
        momentumYThreshold: 15,       // 惯性滑动的启动 距离阈值
        isStarted: false,             // start锁

        isVerticalScroll: false, //是否是垂直滚动
        flag: true //每次touch时重置开关（用于检测每次滚动的方向）
      }
  },
  computed:{
    minX(){
      return this.maxScrollWidth
    },
    minY(){
      return this.maxScrollHeight
    },
  },
  methods: {
      touchStart(e) {

        const point = e.touches ? e.touches[0] : e;
        this.isStarted = true;
        this.inertiaScrollTime = 0;
        this.stop();
        this.pointX = point.pageX;
        this.pointY = point.pageY;
        this.momentumStartX = this.startX = this.translateX;
        this.momentumStartY = this.startY = this.translateY;
        this.startTime = new Date().getTime();
      },
      touchMove(e) {

        // e.preventDefault();
        if (!this.isStarted) return;
        const point = e.touches ? e.touches[0] : e;
        const deltaY = point.pageY - this.pointY;
        const deltaX = point.pageX - this.pointX;

        //每次touch时判断是横向还是纵向滚动（判断完成之后开关关闭，下次touch时开关开启再次判断）
        if (this.flag) {
          this.isVerticalScroll = Math.abs(deltaY) > Math.abs(deltaX) ? true : false
          this.flag = false
        }

        //当横向滚动时禁止纵向滚动
        if (!this.isVerticalScroll){
          // 浮点数坐标会影响渲染速度
          let offsetX = Math.round(this.startX + deltaX);
          this.translateX = offsetX;
          const now = new Date().getTime();
          // 记录在触发惯性滑动条件下的偏移值和时间
          if (now - this.startTime > this.momentumTimeThreshold) {
            this.momentumStartX = this.translateX;
            this.startTime = now;
          }
          // let offsetX;
          if (this.translateX < this.minX) {
            this.translateX = this.minX;
          } else if (this.translateX > this.maxX) {
            this.translateX = this.maxX;
          }

        }else{
          
          // 浮点数坐标会影响渲染速度
          let offsetY = Math.round(this.startY + deltaY);
          // 超出边界时增加阻力
          // if (offsetY < this.minY || offsetY > this.maxY) {
          //   offsetY = Math.round(this.startY + deltaY / 3);
          // }
          this.translateY = offsetY;
          const now = new Date().getTime();
          // 记录在触发惯性滑动条件下的偏移值和时间
          if (now - this.startTime > this.momentumTimeThreshold) {
            this.momentumStartY = this.translateY;
            this.startTime = now;
          }
          if (this.translateY < this.minY) {
            this.translateY = this.minY;
          }else if(this.translateY > this.maxY){
            this.translateY = this.maxY;
          }
        }

        this.isShowLoading = this.translateY > this.maxScrollHeight ? false : true;//解决数据全部加载后提示语不消失问题

        //滚动到底部时加载数据
        this.initData();
      },
      touchEnd(){
        
          this.flag = true

          if (!this.isStarted) return;
          this.isStarted = false;

          //横向滚动
          if(!this.isVerticalScroll){
            const absDeltaX = Math.abs(this.translateX - this.momentumStartX);
            const duration = new Date().getTime() - this.startTime;
            // 启动惯性滑动
            if (duration < this.momentumTimeThreshold && absDeltaX > this.momentumYThreshold) {
              const momentum = this.momentum(this.translateX, this.momentumStartX, duration);
              this.translateX = this.translateX <= this.minX ? this.minX : this.translateX >= this.maxX ? this.maxX : Math.round(momentum.destination);
              this.inertiaScrollTime = momentum.duration;
              this.bezier = momentum.bezier;
              if (this.translateX < this.minX) {
                this.translateX = this.minX;
              } else if (this.translateX > this.maxX) {
                this.translateX = this.maxX;
              }
            }
          }else{
            if (this.isNeedReset()) return;
            const absDeltaY = Math.abs(this.translateY - this.momentumStartY);
            const duration = new Date().getTime() - this.startTime;
            // 启动惯性滑动
            if (duration < this.momentumTimeThreshold && absDeltaY > this.momentumYThreshold) {
              const momentum = this.momentum(this.translateY, this.momentumStartY, duration,"vertical");
              
              this.translateY = this.translateY <= this.minY ? this.minY : this.translateY >= this.maxY ? this.maxY : Math.round(momentum.destination);
              this.inertiaScrollTime = momentum.duration;
              this.bezier = momentum.bezier;
              if (this.translateY < this.minY) {
                this.translateY = this.minY;
              } else if (this.translateY > this.maxY) {
                this.translateY = this.maxY;
              }
            }
          }

      },
      onTransitionEnd(){
        this.isNeedReset()
      },
      // 超出边界时需要重置位置
      isNeedReset() {
        let offsetY;
        if (this.translateY <= this.minY) {
          offsetY = this.minY;

          //滚动到底部时加载数据
          this.initData();

        } else if (this.translateY > this.maxY) {
          offsetY = this.maxY;
        }
        if (typeof offsetY !== 'undefined') {
          this.translateY = offsetY;
          this.inertiaScrollTime = 500;
          this.bezier = 'cubic-bezier(.165, .84, .44, 1)';
          return true;
        }
        return false;
      },
      //惯性函数
      momentum(current, start, duration,direction) {
        const durationMap = {
          'noBounce': 2500,
          'weekBounce': 800,
          'strongBounce': 400,
        };
        const bezierMap = {
          'noBounce': 'cubic-bezier(.17, .89, .45, 1)',
          'weekBounce': 'cubic-bezier(.25, .46, .45, .94)',
          'strongBounce': 'cubic-bezier(.25, .46, .45, .94)',
        };
        let type = 'noBounce';
        // 惯性滑动加速度
        const deceleration = 0.003;
        // 回弹阻力
        const bounceRate = 10;
        // 强弱回弹的分割值
        const bounceThreshold = 300;
        // 回弹的最大限度
        const maxOverflowY = this.$refs.tableRightBody.getBoundingClientRect().height / 6;
        const maxOverflowX = this.$refs.tableRightBody.getBoundingClientRect().width / 6;
        let overflowY,overflowX;
  
        const distance = current - start;
        const speed = 2 * Math.abs(distance) / duration;
        let destination = current + speed / deceleration * (distance < 0 ? -1 : 1);

        if(direction=="vertical"){
          if (destination < this.minY) {
            overflowY = this.minY - destination;
            type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
            destination = Math.max(this.minY - maxOverflowY, this.minY - overflowY / bounceRate);
          } else if (destination > this.maxY) {
            overflowY = destination - this.maxY;
            type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
            destination = Math.min(this.maxY + maxOverflowY, this.maxY + overflowY / bounceRate);
          }
        }else{
          if (destination < this.minX) {
            overflowX = this.minX - destination;
            type = overflowX > bounceThreshold ? 'strongBounce' : 'weekBounce';
            destination = Math.max(this.minX - maxOverflowX, this.minX - overflowX / bounceRate);
          } else if (destination > this.maxX) {
            overflowX = destination - this.maxX;
            type = overflowX > bounceThreshold ? 'strongBounce' : 'weekBounce';
            destination = Math.min(this.maxX + maxOverflowX, this.maxX + overflowX / bounceRate);
          }
        }
  
        return {
          destination,
          duration: durationMap[type],
          bezier: bezierMap[type],
        };
      },
      stop() {
        // 获取当前 translate 的位置
        const matrix = window.getComputedStyle(this.$refs.tableRightBody_table).getPropertyValue('transform');
        this.translateX = Math.round(+matrix.split(')')[0].split(', ')[4]);
        this.translateY = Math.round(+matrix.split(')')[0].split(', ')[5]);
      },
  }
}