;
(function($) {
/*
需要修改的就是第74行的奖品数组和第93行的中奖概率数组
*/
	var uid = "";
	if(getQueryString("uid")) {
		uid = getQueryString("uid");
	}
	console.log("uid：" + uid)
	//获取用户信息，剩余积分和抽奖次数等
	//抽奖部分--------------------------------------------------------------

	var luck = {
		index: -1, //当前转动到哪个位置，起点位置
		count: 10, //总共有多少个位置
		timer: 0, //setTimeout的ID，用clearTimeout清除
		speed: 20, //初始转动速度
		times: 0, //转动次数
		cycle: 50, //转动基本次数：即至少需要转动多少次再进入抽奖环节
		prize: -1, //中奖位置
		init: function(id) {
			if($("#" + id).find(".luck-unit").length > 0) {
				$luck = $("#" + id);
				$units = $luck.find(".luck-unit");
				this.obj = $luck;
				this.count = $units.length;
				$luck.find(".luck-unit-" + this.index).addClass("active");
			};
		},
		roll: function() {
			var index = this.index;
			var count = this.count;
			var luck = this.obj;
			$(luck).find(".luck-unit-" + index).removeClass("active");
			index += 1;
			if(index > count - 1) {
				index = 0;
			};
			$(luck).find(".luck-unit-" + index).addClass("active");
			this.index = index;
			return false;
		},
		stop: function(index) {
			this.prize = index;
			return false;
		}
	};

	// 初始化
	var click = false;

	luck.init('luck');
	//开始抽奖
	$("#btn").click(function() {
		if(click) 
		return false;

		luck.speed = 100;
		roll();
		click = true;
	});
	// 抽奖控制函数
	function roll() {
		luck.times += 1;
		luck.roll();

		if(luck.times > luck.cycle + 10 && luck.prize == luck.index) {
			clearTimeout(luck.timer);
			luck.prize = -1;
			luck.times = 0;
			click = false;
			//奖品
			var arr = ["6积分","1元红包","100元京东卡","2元红包","继续努力","20积分","0.1元红包","100积分","0.5元红包","继续努力"];
			//抽奖结束后的操作-------------------------
			
			setTimeout(function(){
				//中奖
				$(".tanchuang .tips").html("今天运气不错，您抽中了"+arr[luck.index]+"，好运连连，努力中大奖哦!");
				$(".tanchuang").show();
				//未中奖
				if((luck.index == 4) || (luck.index == 9)){
					$(".tanchuang .tips").html("太可惜啦，差一点点就中奖啦！");
					$(".tanchuang").show();
				}
			},500)
		} else {
			if(luck.times < luck.cycle) {
				luck.speed -= 10;
			} else if(luck.times == luck.cycle) {
				//设置中奖概率，对应的奖品id从0到9，数组每一项分别为对应的中奖概率
				
				var arr = [30,3,0,2,10,19,25,6,5,10];
				
				//计算概率
	    		function get_rand(proArr) {     
				    var result = '';      
				    //概率数组的总概率精度，一般是100    
				    var proSum = eval(proArr.join("+"))
				    //概率数组循环   
				    for(var i=0;i<proArr.length;i++){
				    		//产生随机数，比如概率综合是100就生产1到100之间的；
				    		var random = Math.random() * proSum | 1;
				    		if (random <= proArr[i]) {     
			            		result = i;     
				            break;     
				        } else {     
				            proSum -= proArr[i];     
				        }  
				    }
				    return result;     
				}  
				// 计算概率结束
				
				luck.prize = get_rand(arr);
				console.log(luck.prize);
				
			} else {
				if(luck.times > luck.cycle + 10 && ((luck.prize == 0 && luck.index == 7) || luck.prize == luck.index + 1)) {
					luck.speed += 110;
				} else {
					luck.speed += 20;
				}
			}
			if(luck.speed < 40) {
				luck.speed = 40;
			};

			luck.timer = setTimeout(roll, luck.speed);
		}
		return false;
	}
	// 抽奖结束
	
	
	
	$(".sure").on("click",function(){
		$(".tanchuang").hide();
	})

	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}

	setTimeout(function() {
		$("body").show();
		$(".loading").hide();
	}, 500)

})(jQuery)