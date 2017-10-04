window.onload=function()
{
    var startBtn=document.getElementById("gameBtn");
    startBtn.onclick=function()
    {
        this.style.display='none';
        Game.init('div1');
    }
};

var Game=
{
    oEnemy://敌人
    {
        e1:{style:'enemy1',blood:1,speed:5,score:1},
        e2:{style:'enemy2',blood:2,speed:7,score:2},
        e3:{style:'enemy3',blood:3,speed:10,score:3}
    },
    gk:[//关卡数据
        {
            eMap:[
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum:10,
            isSpeedX:10,
            isSpeedY:10,
            times:2000
        },
        {
            eMap:[
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum:10,
            isSpeedX:10,
            isSpeedY:10,
            times:2000
        }
    ],
    ari1://飞机数据
    {
        style:'air1',
        bulletStyle:'bullet'
    },
    init:function(id)//游戏初始化，开始游戏
    {
        this.oParent=document.getElementById(id);
        this.createScore();
        this.createEnemy(0);
        this.createAir();
        this.binAir();
    },
    createScore:function()//积分的创建
    {
        var oS=document.createElement("div");
        oS.id="score";
        oS.innerHTML='积分:<span>0</span>';
        this.oParent.appendChild(oS);

        this.osNumber=oS.getElementsByTagName("span")[0];//把积分加入Game对象属性,以便操作更改积分
    },
    createEnemy:function(iNow)//创建敌人
    {
        if(this.oUl)
        {
            clearInterval(this.oUl.timer);
            this.oParent.removeChild(this.oUl);
        }
        var gk=this.gk[iNow];
        var oUl=document.createElement("ul");
        oUl.id="bee";
        this.oUl=oUl;
        oUl.style.width=gk.colNum*40+"px";
        this.oParent.appendChild(oUl);//要添加完之后才设oUl的宽
        oUl.style.left=(this.oParent.offsetWidth-oUl.offsetWidth)/2+"px";//让整个敌人盒居中

        var arrSet=[];
        for(var i=0;i<gk.eMap.length;i++)
        {
            var oLi=document.createElement("li");
            oLi.className=this.oEnemy[gk.eMap[i]].style;
            oLi.blood=this.oEnemy[gk.eMap[i]].blood;
            oLi.speed=this.oEnemy[gk.eMap[i]].speed;
            oLi.score=this.oEnemy[gk.eMap[i]].score;
            oUl.appendChild(oLi);
        }
        this.allLi=oUl.getElementsByTagName("li");

        for(i=0;i<this.allLi.length;i++)
        {
            arrSet.push([this.allLi[i].offsetLeft,this.allLi[i].offsetTop]);
        }
        for(i=0;i<this.allLi.length;i++)
        {
            this.allLi[i].style.position="absolute";
            this.allLi[i].style.left=arrSet[i][0]+"px";
            this.allLi[i].style.top=arrSet[i][1]+"px";
        }
        this.runEnemy(gk);
    },
    runEnemy:function(gk)//移动敌人
    {
        var self=this,
            l= 0,
            r=this.oParent.offsetWidth-this.oUl.offsetWidth;
        this.oUl.timer=setInterval(function(){
            if(self.oUl.offsetLeft>r)
            {
                gk.isSpeedX*=-1;
                self.oUl.style.top=self.oUl.offsetTop+gk.isSpeedY+"px";
            }
            else if(self.oUl.offsetLeft<l)
            {
                gk.isSpeedX*=-1;
                self.oUl.style.top=self.oUl.offsetTop+gk.isSpeedY+"px";
            }
            self.oUl.style.left=self.oUl.offsetLeft+gk.isSpeedX+"px";
        },200);
        setInterval(function(){
            self.oneMove();
        },gk.times)
    },
    oneMove:function()//单个敌人飞行
    {

        var nowLi =this.allLi[Math.floor(Math.random()*this.allLi.length)],self=this;
        nowLi.temer=setInterval(function(){
            var a=(self.oA.offsetLeft+self.oA.offsetWidth/2)-(nowLi.offsetLeft+nowLi.parentNode.offsetLeft+nowLi.offsetWidth/2);
            var b=(self.oA.offsetTop+self.oA.offsetHeight/2)-(nowLi.offsetTop+nowLi.parentNode.offsetTop+nowLi.offsetHeight/2);
            var c=Math.sqrt(a*a+b*b);
            var isX=nowLi.speed*a/c;
            var isY=nowLi.speed*b/c;
            nowLi.style.left=nowLi.offsetLeft+isX+"px";
            nowLi.style.top=nowLi.offsetTop+isY+"px";

            if(self.pzCheck(self.oA,nowLi))
            {
                alert("游戏结束！");
                  window.location.reload();
            }
        },30)
    },
    createAir:function()//飞机的创建(自己军机)
    {
        var oA=document.createElement("div");
        this.oA=oA;
        oA.className=this.ari1.style;
        this.oParent.appendChild(oA);
        oA.style.left=(this.oParent.offsetWidth-oA.offsetWidth)/2+"px";
        oA.style.top=this.oParent.offsetHeight-oA.offsetHeight+"px";
    },
    binAir:function()//操作移动飞机
    {
        var timer=null,
            toDir= 0,
            self=this;
        document.onkeyup=function(e)
        {
            var event=e?e:window.event;
            clearInterval(timer);
            timer=null;
            toDir=0;
            if(event.keyCode==32)
            {
                self.createBullet();
            }
        };
        document.onkeydown=function(e)
        {
            var event=e?e:window.event;
            if(!timer)
            {
                timer=setInterval(show,30);
            }
            if(event.keyCode==37)//向左
            {
                toDir=1;
                /* alert("left");*/
            }
            else if(event.keyCode==38)//向上
            {
                toDir=3;
                /* alert("left");*/
            }
            else if(event.keyCode==40)//向下
            {
                toDir=4;
                /* alert("left");*/
            }
            else if(event.keyCode==39)//向右
            {
                toDir=2;
                /* alert("right");*/
            }
        };
        function show()
        {
            if(toDir==1)
            {
                if(self.oA.style.left<="-5px")
                    self.oA.style.left="-5px";
                else
                    self.oA.style.left=self.oA.offsetLeft-10+"px";
            }
            else if(toDir==2)
            {
                if(parseInt(self.oA.style.left)>=self.oA.parentNode.offsetWidth-self.oA.offsetWidth)
                    self.oA.style.left=self.oA.parentNode.offsetWidth-self.oA.offsetWidth+"px";
                else
                self.oA.style.left=self.oA.offsetLeft+10+"px";
            }
            else if(toDir==3)
            {
                if(parseInt(self.oA.style.top)<=0)
                    self.oA.style.top=0+"px";
                else
                    self.oA.style.top=self.oA.offsetTop-10+"px";
            }
            else if(toDir==4)
            {
                if(parseInt(self.oA.style.top)>=self.oA.parentNode.offsetHeight-self.oA.offsetHeight)
                    self.oA.style.top=self.oA.parentNode.offsetHeight-self.oA.offsetHeight+"px";
                else
                    self.oA.style.top=self.oA.offsetTop+10+"px";
            }
        }
    },
    createBullet:function()//创建子弹
    {
        var oB=document.createElement("div");
        oB.className=this.ari1.bulletStyle;
        this.oParent.appendChild(oB);
        oB.style.left=this.oA.offsetLeft+this.oA.offsetWidth/2+"px";
        oB.style.top=this.oA.offsetTop-10+"px";//10子弹的高度this.oA.offsetHeight
        this.runBullet(oB);
    },
    runBullet:function(oB)//子弹移动
    {
        var self=this;
        oB.timer=setInterval(function(){
            if(oB.offsetTop<-10)
            {
                clearInterval(oB.timer);
                self.oParent.removeChild(oB);
            }
            else
                oB.style.top=oB.offsetTop-10+"px";

            for(var i=0;i<self.allLi.length;i++)
            {
                if(self.pzCheck(oB,self.allLi[i]))//判断是否碰撞上了
                {
                    //碰撞上就删除敌人
                    if(self.allLi[i].blood==1)//如果血量等于1就删除
                    {
                        /* self.osNumber.innerHTML=parseInt(self.osNumber.innerHTML)+self.allLi[i].score;*/
                        /*  alert(self.osNumber.innerHTML)
                         alert(self.allLi[i].score)*/
                        clearInterval(self.allLi[i].temer);
                        self.oUl.removeChild(self.allLi[i]);
                        self.osNumber.innerHTML=parseInt(self.osNumber.innerHTML)+self.allLi[i].score
                    }
                    else
                    {
                        self.allLi[i].blood--;
                    }
                    clearInterval(oB.timer);
                    self.oParent.removeChild(oB);//元素删除了，定时器没有删除

                }
            }
            if(!self.allLi.length)
            {
                self.createEnemy(1);
            }
        },30)
    },
    pzCheck:function(oBullet,oEnemy)//碰撞检测，原理是检测子弹、敌人四周是否相交，
    {
        var L1=oBullet.offsetLeft,
            R1=oBullet.offsetLeft+oBullet.offsetWidth,
            T1=oBullet.offsetTop,
            B1=oBullet.offsetHeight+oBullet.offsetTop;

        var L2=oEnemy.offsetLeft+oEnemy.parentNode.offsetLeft,
            R2=oEnemy.offsetLeft+oEnemy.offsetWidth+oEnemy.parentNode.offsetLeft,
            T2=oEnemy.offsetTop+oEnemy.parentNode.offsetTop,
            B2=oEnemy.offsetHeight+oEnemy.offsetTop+oEnemy.parentNode.offsetTop;//加上父节点，让子弹和敌人相对于大黑框计算位置，

        if(R1<L2||L1>R2||B1<T2||T1>B2)
            return false;
        else
            return true;
    }
};
